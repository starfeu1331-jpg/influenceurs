import { Influencer, StatsSnapshot, CollaborationStats } from "@prisma/client";
import { Platform, StatsPeriod } from "@/lib/types";

export type InfluencerWithStats = {
  influencer: Influencer & { platforms: { platform: string; isMain: boolean }[] };
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

// 1. Impact collabs (0-100)
function computeImpactCollabsScore(collaborationStats: CollaborationStats[]): number {
  const collabsWithViews = collaborationStats.filter(c => c.views !== null && c.views > 0);
  
  if (collabsWithViews.length === 0) return 0;

  // Calculer les moyennes
  const avgViews = collabsWithViews.reduce((sum, c) => sum + (c.views || 0), 0) / collabsWithViews.length;
  
  const collabsWithLikes = collabsWithViews.filter(c => c.likes !== null && c.likes > 0);
  const avgLikes = collabsWithLikes.length > 0
    ? collabsWithLikes.reduce((sum, c) => sum + (c.likes || 0), 0) / collabsWithLikes.length
    : 0;
  
  const collabsWithComments = collabsWithViews.filter(c => c.comments !== null && c.comments > 0);
  const avgComments = collabsWithComments.length > 0
    ? collabsWithComments.reduce((sum, c) => sum + (c.comments || 0), 0) / collabsWithComments.length
    : 0;

  // Normaliser chaque métrique
  const viewsScore = normalizeViews(avgViews);
  const likesScore = normalizeLikes(avgLikes);
  const commentsScore = normalizeComments(avgComments);

  // Pondération : 70% vues, 20% likes, 10% comments
  let totalWeight = 0.7; // vues toujours présentes
  let score = viewsScore * 0.7;

  if (collabsWithLikes.length > 0) {
    totalWeight += 0.2;
    score += likesScore * 0.2;
  }

  if (collabsWithComments.length > 0) {
    totalWeight += 0.1;
    score += commentsScore * 0.1;
  }

  // Si pas de likes ou comments, redistribuer le poids
  if (totalWeight < 1) {
    score = score / totalWeight;
  }

  return Math.min(score, 100);
}

// 2. Potentiel organique (0-100)
function computeOrganicPotentialScore(
  influencer: Influencer & { platforms: { platform: string; isMain: boolean }[] },
  statsSnapshots: StatsSnapshot[]
): number {
  // Filtrer sur la plateforme principale
  const mainPlatform = influencer.platforms.find(p => p.isMain)?.platform || influencer.platforms[0]?.platform;
  const relevantStats = statsSnapshots.filter(
    s => s.platform === mainPlatform && s.avgViews !== null && s.avgViews > 0
  );

  if (relevantStats.length === 0) return 0;

  // Grouper par période
  const statsByPeriod: Record<string, StatsSnapshot[]> = {
    LAST_15_DAYS: [],
    LAST_30_DAYS: [],
    LAST_3_MONTHS: [],
  };

  relevantStats.forEach(s => {
    statsByPeriod[s.period].push(s);
  });

  // Calculer le score par période
  const periodScores: { period: string; score: number; baseWeight: number }[] = [];

  if (statsByPeriod.LAST_15_DAYS.length > 0) {
    const avgViews = statsByPeriod.LAST_15_DAYS.reduce((sum, s) => sum + (s.avgViews || 0), 0) / statsByPeriod.LAST_15_DAYS.length;
    periodScores.push({ period: 'LAST_15_DAYS' as string, score: normalizeViews(avgViews), baseWeight: 0.5 });
  }

  if (statsByPeriod.LAST_30_DAYS.length > 0) {
    const avgViews = statsByPeriod.LAST_30_DAYS.reduce((sum, s) => sum + (s.avgViews || 0), 0) / statsByPeriod.LAST_30_DAYS.length;
    periodScores.push({ period: 'LAST_30_DAYS' as string, score: normalizeViews(avgViews), baseWeight: 0.3 });
  }

  if (statsByPeriod.LAST_3_MONTHS.length > 0) {
    const avgViews = statsByPeriod.LAST_3_MONTHS.reduce((sum, s) => sum + (s.avgViews || 0), 0) / statsByPeriod.LAST_3_MONTHS.length;
    periodScores.push({ period: 'LAST_3_MONTHS' as string, score: normalizeViews(avgViews), baseWeight: 0.2 });
  }

  if (periodScores.length === 0) return 0;

  // Recalculer les poids sur les périodes disponibles
  const totalWeight = periodScores.reduce((sum, p) => sum + p.baseWeight, 0);
  const normalizedScores = periodScores.map(p => ({
    ...p,
    weight: p.baseWeight / totalWeight,
  }));

  // Score pondéré
  let finalScore = normalizedScores.reduce((sum, p) => sum + p.score * p.weight, 0);

  // Bonus si dynamique positive (15j > 3 mois)
  const score15d = periodScores.find(p => p.period === 'LAST_15_DAYS');
  const score3m = periodScores.find(p => p.period === 'LAST_3_MONTHS');
  
  if (score15d && score3m && score15d.score > score3m.score) {
    finalScore = Math.min(finalScore + 5, 100);
  }

  return finalScore;
}

// 3. Rentabilité (0-100)
function computeProfitabilityScore(collaborationStats: CollaborationStats[]): number {
  const collabsWithPriceAndViews = collaborationStats.filter(
    c => c.price !== null && c.price > 0 && c.views !== null && c.views > 0
  );

  if (collabsWithPriceAndViews.length === 0) return 0;

  // Calculer le CPV de chaque collab
  const cpvScores = collabsWithPriceAndViews.map(c => {
    const cpv = c.price! / c.views!;
    return scoreFromCPV(cpv);
  });

  // Moyenne des scores
  const avgScore = cpvScores.reduce((sum, s) => sum + s, 0) / cpvScores.length;
  return avgScore;
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
  const impactCollabsScore = computeImpactCollabsScore(collaborationStats);
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
  const organicAvailable = statsSnapshots.some(s => s.avgViews !== null && s.avgViews > 0);
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
  };
}
