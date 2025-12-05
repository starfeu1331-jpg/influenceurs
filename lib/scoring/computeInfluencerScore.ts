import { Influencer, StatsSnapshot, CollaborationStats, InfluencerPricing } from "@prisma/client";
import { Platform, StatsPeriod } from "@/lib/types";
import { calculateROI, evaluateProfitability, BASE_PRICES, type ContentFormat } from "@/lib/pricing/pricing";

export type InfluencerWithStats = {
  influencer: Influencer & { 
    platforms: { platform: string; isMain: boolean; followers?: number | null }[];
    pricing: InfluencerPricing[];
  };
  statsSnapshots: StatsSnapshot[];
  collaborationStats: CollaborationStats[];
};

export type ComputedScore = {
  totalScore: number;
  impactCollabsScore: number;
  organicPotentialScore: number;
  profitabilityScore: number;
  strategicFitScore: number;
  weightImpactCollabs: number;
  weightOrganicPotential: number;
  weightProfitability: number;
  weightStrategicFit: number;
  // ROI prévisionnel
  estimatedViews?: number;
  estimatedCPV?: number;
  roiScore?: number;
  // Détail par format
  formatBreakdown?: {
    format: string;
    count: number;
    avgPrice: number;
    avgViews: number;
    cpv: number;
    roiScore: number;
  }[];
};

// Normalisation des vues (0-100)
function normalizeViews(avgViews: number): number {
  if (!avgViews || avgViews <= 0) return 0;
  const maxRef = 100_000; // 100k vues = 100/100
  const score = (avgViews / maxRef) * 100;
  return Math.min(score, 100);
}

// Normalisation des likes (0-100)
function normalizeLikes(avgLikes: number): number {
  if (!avgLikes || avgLikes <= 0) return 0;
  const maxRef = 5_000; // 5k likes = 100/100
  const score = (avgLikes / maxRef) * 100;
  return Math.min(score, 100);
}

// Normalisation des commentaires (0-100)
function normalizeComments(avgComments: number): number {
  if (!avgComments || avgComments <= 0) return 0;
  const maxRef = 500; // 500 commentaires = 100/100
  const score = (avgComments / maxRef) * 100;
  return Math.min(score, 100);
}

// Calcul du score de rentabilité à partir du CPV
function scoreFromCPV(cpv: number): number {
  const best = 0.0001; // 0.0001 €/vue = excellent
  const worst = 0.01; // 0.01 €/vue = très mauvais
  if (!cpv || cpv >= worst) return 0;
  if (cpv <= best) return 100;
  const ratio = (cpv - best) / (worst - best);
  return Math.max(0, Math.min(100, 100 * (1 - ratio)));
}

// 1. Impact collabs (0-100) - Basé sur le ROI réel par format
function computeImpactCollabsScore(collaborationStats: CollaborationStats[]): {
  score: number;
  breakdown: {
    format: string;
    count: number;
    avgPrice: number;
    avgViews: number;
    cpv: number;
    roiScore: number;
  }[];
} {
  const collabsWithViews = collaborationStats.filter(c => c.views !== null && c.views > 0);
  
  if (collabsWithViews.length === 0) {
    return { score: 0, breakdown: [] };
  }

  // Grouper par format
  const byFormat: Record<string, CollaborationStats[]> = {};
  collabsWithViews.forEach(c => {
    const format = c.formatType || 'OTHER';
    if (!byFormat[format]) byFormat[format] = [];
    byFormat[format].push(c);
  });

  // Calculer le score par format
  const breakdown = Object.entries(byFormat).map(([format, stats]) => {
    const count = stats.length;
    
    // Calculer moyennes
    const avgViews = stats.reduce((sum, s) => sum + (s.views || 0), 0) / count;
    const avgLikes = stats.reduce((sum, s) => sum + (s.likes || 0), 0) / count;
    const avgComments = stats.reduce((sum, s) => sum + (s.comments || 0), 0) / count;
    
    // Calculer prix moyen (ou utiliser prix de référence)
    const statsWithPrice = stats.filter(s => s.price && s.price > 0);
    let avgPrice: number;
    
    if (statsWithPrice.length > 0) {
      avgPrice = statsWithPrice.reduce((sum, s) => sum + (s.price || 0), 0) / statsWithPrice.length;
    } else {
      // Utiliser prix de référence si pas de prix renseigné
      avgPrice = BASE_PRICES[format as ContentFormat] || BASE_PRICES.OTHER;
    }
    
    // Calculer ROI avec le module pricing
    const roi = calculateROI(avgPrice, avgViews, avgLikes, avgComments);
    
    return {
      format,
      count,
      avgPrice,
      avgViews,
      cpv: roi.cpv,
      roiScore: roi.roiScore,
    };
  });

  // Score global = moyenne pondérée par nombre de collabs
  const totalCollabs = breakdown.reduce((sum, b) => sum + b.count, 0);
  const weightedScore = breakdown.reduce((sum, b) => {
    const weight = b.count / totalCollabs;
    return sum + (b.roiScore * weight);
  }, 0);

  return {
    score: Math.round(weightedScore * 100) / 100,
    breakdown,
  };
}

// 2. Potentiel organique (0-100) - Basé sur ROI potentiel (tarifs × stats organiques)
function computeOrganicPotentialScore(
  influencer: Influencer & { 
    platforms: { platform: string; isMain: boolean; followers?: number | null }[];
    pricing: InfluencerPricing[];
  },
  statsSnapshots: StatsSnapshot[]
): number {
  // Si pas de tarifs définis, on ne peut pas calculer le potentiel
  if (!influencer.pricing || influencer.pricing.length === 0) {
    return 0;
  }

  // Filtrer sur la plateforme principale
  const mainPlatform = influencer.platforms.find(p => p.isMain)?.platform || influencer.platforms[0]?.platform;
  const relevantStats = statsSnapshots.filter(
    s => s.platform === mainPlatform && s.avgViews !== null && s.avgViews > 0
  );

  if (relevantStats.length === 0) return 0;

  // Calculer la moyenne des vues sur les périodes récentes (priorité aux plus récentes)
  const statsByPeriod: Record<string, StatsSnapshot[]> = {
    LAST_15_DAYS: [],
    LAST_30_DAYS: [],
    LAST_3_MONTHS: [],
  };

  relevantStats.forEach(s => {
    if (statsByPeriod[s.period]) {
      statsByPeriod[s.period].push(s);
    }
  });

  // Prendre les stats les plus récentes disponibles
  let avgViews = 0;
  let avgLikes = 0;
  let avgComments = 0;

  if (statsByPeriod.LAST_15_DAYS.length > 0) {
    const stats = statsByPeriod.LAST_15_DAYS;
    avgViews = stats.reduce((sum, s) => sum + (s.avgViews || 0), 0) / stats.length;
    avgLikes = stats.reduce((sum, s) => sum + (s.avgLikes || 0), 0) / stats.length;
    avgComments = stats.reduce((sum, s) => sum + (s.avgComments || 0), 0) / stats.length;
  } else if (statsByPeriod.LAST_30_DAYS.length > 0) {
    const stats = statsByPeriod.LAST_30_DAYS;
    avgViews = stats.reduce((sum, s) => sum + (s.avgViews || 0), 0) / stats.length;
    avgLikes = stats.reduce((sum, s) => sum + (s.avgLikes || 0), 0) / stats.length;
    avgComments = stats.reduce((sum, s) => sum + (s.avgComments || 0), 0) / stats.length;
  } else if (statsByPeriod.LAST_3_MONTHS.length > 0) {
    const stats = statsByPeriod.LAST_3_MONTHS;
    avgViews = stats.reduce((sum, s) => sum + (s.avgViews || 0), 0) / stats.length;
    avgLikes = stats.reduce((sum, s) => sum + (s.avgLikes || 0), 0) / stats.length;
    avgComments = stats.reduce((sum, s) => sum + (s.avgComments || 0), 0) / stats.length;
  }

  if (avgViews === 0) return 0;

  // Calculer le score ROI potentiel pour chaque format tarifé
  const roiScores = influencer.pricing.map(pricing => {
    // Calculer le ROI potentiel : prix / vues organiques
    const roi = calculateROI(pricing.price, avgViews, avgLikes, avgComments);
    return roi.roiScore;
  });

  if (roiScores.length === 0) return 0;

  // Moyenne des scores ROI potentiels
  const avgROIScore = roiScores.reduce((sum, s) => sum + s, 0) / roiScores.length;

  return Math.round(avgROIScore * 100) / 100;
}

// 3. Rentabilité (0-100) - Basé sur le CPV réel par format
function computeProfitabilityScore(collaborationStats: CollaborationStats[]): number {
  const collabsWithPriceAndViews = collaborationStats.filter(
    c => c.price !== null && c.price > 0 && c.views !== null && c.views > 0
  );

  if (collabsWithPriceAndViews.length === 0) return 0;

  // Grouper par format
  const byFormat: Record<string, CollaborationStats[]> = {};
  collabsWithPriceAndViews.forEach(c => {
    const format = c.formatType || 'OTHER';
    if (!byFormat[format]) byFormat[format] = [];
    byFormat[format].push(c);
  });

  // Calculer le score par format
  const formatScores = Object.entries(byFormat).map(([format, stats]) => {
    const cpvScores = stats.map(c => {
      const cpv = c.price! / c.views!;
      const { score } = evaluateProfitability(cpv);
      return score;
    });
    
    const avgScore = cpvScores.reduce((sum, s) => sum + s, 0) / cpvScores.length;
    return { format, score: avgScore, count: stats.length };
  });

  // Moyenne pondérée par nombre de collabs
  const totalCollabs = formatScores.reduce((sum, f) => sum + f.count, 0);
  const weightedScore = formatScores.reduce((sum, f) => {
    const weight = f.count / totalCollabs;
    return sum + (f.score * weight);
  }, 0);

  return Math.round(weightedScore * 100) / 100;
}

// 4. Fit stratégique (0-100)
function computeStrategicFitScore(influencer: Influencer): number {
  const scores: number[] = [];

  if (influencer.fitThemeScore !== null && influencer.fitThemeScore !== undefined) {
    scores.push(influencer.fitThemeScore);
  }
  if (influencer.fitGeoScore !== null && influencer.fitGeoScore !== undefined) {
    scores.push(influencer.fitGeoScore);
  }
  if (influencer.fitTimingScore !== null && influencer.fitTimingScore !== undefined) {
    scores.push(influencer.fitTimingScore);
  }

  if (scores.length === 0) return 0;

  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return Math.min(avgScore, 100);
}

// 5. ROI prévisionnel (désactivé - budgetFutur supprimé du modèle)
function computeROIEstimate(
  influencer: Influencer,
  collaborationStats: CollaborationStats[]
): { estimatedViews: number; estimatedCPV: number; roiScore: number } | null {
  return null;
}

// Fonction principale
export async function computeInfluencerScore(
  data: InfluencerWithStats
): Promise<ComputedScore> {
  const { influencer, statsSnapshots, collaborationStats } = data;

  // Calculer chaque sous-score
  const impactResult = computeImpactCollabsScore(collaborationStats);
  const impactCollabsScore = impactResult.score;
  const organicPotentialScore = computeOrganicPotentialScore(influencer, statsSnapshots);
  const profitabilityScore = computeProfitabilityScore(collaborationStats);
  const strategicFitScore = computeStrategicFitScore(influencer);

  // Pondérations de base
  const baseImpact = 40;
  const baseOrganic = 25;
  const baseProfit = 15;
  const baseFit = 20;

  // Vérifier disponibilité de chaque bloc
  const impactAvailable = collaborationStats.some(c => c.views !== null && c.views > 0);
  const organicAvailable = 
    statsSnapshots.some(s => s.avgViews !== null && s.avgViews > 0) &&
    influencer.pricing && influencer.pricing.length > 0; // BESOIN des tarifs ET des stats
  const profitAvailable = collaborationStats.some(
    c => c.price !== null && c.price > 0 && c.views !== null && c.views > 0
  );
  const fitAvailable =
    influencer.fitThemeScore !== null ||
    influencer.fitGeoScore !== null ||
    influencer.fitTimingScore !== null;

  // Calculer la somme des poids disponibles
  let sumBase = 0;
  if (impactAvailable) sumBase += baseImpact;
  if (organicAvailable) sumBase += baseOrganic;
  if (profitAvailable) sumBase += baseProfit;
  if (fitAvailable) sumBase += baseFit;

  // Si aucune donnée, retourner un score à 0
  if (sumBase === 0) {
    return {
      totalScore: 0,
      impactCollabsScore: 0,
      organicPotentialScore: 0,
      profitabilityScore: 0,
      strategicFitScore: 0,
      weightImpactCollabs: 0,
      weightOrganicPotential: 0,
      weightProfitability: 0,
      weightStrategicFit: 0,
      formatBreakdown: [],
    };
  }

  // Calculer les poids effectifs (normalisés à 1)
  const weightImpactCollabs = impactAvailable ? baseImpact / sumBase : 0;
  const weightOrganicPotential = organicAvailable ? baseOrganic / sumBase : 0;
  const weightProfitability = profitAvailable ? baseProfit / sumBase : 0;
  const weightStrategicFit = fitAvailable ? baseFit / sumBase : 0;

  // Score total
  const totalScore =
    impactCollabsScore * weightImpactCollabs +
    organicPotentialScore * weightOrganicPotential +
    profitabilityScore * weightProfitability +
    strategicFitScore * weightStrategicFit;

  // ROI prévisionnel
  const roiEstimate = computeROIEstimate(influencer, collaborationStats);

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    impactCollabsScore: Math.round(impactCollabsScore * 100) / 100,
    organicPotentialScore: Math.round(organicPotentialScore * 100) / 100,
    profitabilityScore: Math.round(profitabilityScore * 100) / 100,
    strategicFitScore: Math.round(strategicFitScore * 100) / 100,
    weightImpactCollabs: Math.round(weightImpactCollabs * 10000) / 100,
    weightOrganicPotential: Math.round(weightOrganicPotential * 10000) / 100,
    weightProfitability: Math.round(weightProfitability * 10000) / 100,
    weightStrategicFit: Math.round(weightStrategicFit * 10000) / 100,
    estimatedViews: roiEstimate?.estimatedViews,
    estimatedCPV: roiEstimate?.estimatedCPV,
    roiScore: roiEstimate?.roiScore,
    formatBreakdown: impactResult.breakdown,
  };
}
