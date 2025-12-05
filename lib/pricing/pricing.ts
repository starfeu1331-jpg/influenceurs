// Tarifs de base par format (en euros)
export const BASE_PRICES = {
  // Instagram
  REEL: 800,
  STORY: 200,
  STORY_SET: 500, // Set de 3-5 stories
  POST_FEED: 600,
  POST_CARROUSEL: 700,
  
  // TikTok
  TIKTOK_VIDEO: 600,
  TIKTOK_SERIE: 1500, // Série de 3 vidéos
  
  // YouTube
  YOUTUBE_VIDEO: 2000,
  YOUTUBE_SHORT: 500,
  YOUTUBE_INTEGRATION: 1500, // Intégration dans vidéo existante
  
  // Autres
  OTHER: 500,
} as const;

export type ContentFormat = keyof typeof BASE_PRICES;

// Calcul du prix basé sur les followers
export function calculatePrice(
  format: ContentFormat,
  followers: number,
  platformMultiplier: number = 1
): number {
  const basePrice = BASE_PRICES[format] || 500;
  
  // Multiplicateur basé sur les followers
  let followerMultiplier = 1;
  
  if (followers < 10000) {
    followerMultiplier = 0.5; // Micro-influenceur
  } else if (followers < 50000) {
    followerMultiplier = 0.8;
  } else if (followers < 100000) {
    followerMultiplier = 1.0;
  } else if (followers < 500000) {
    followerMultiplier = 1.5;
  } else if (followers < 1000000) {
    followerMultiplier = 2.0;
  } else {
    followerMultiplier = 3.0; // Macro-influenceur
  }
  
  return Math.round(basePrice * followerMultiplier * platformMultiplier);
}

// Calcul du CPV (Coût Par Vue)
export function calculateCPV(price: number, views: number): number {
  if (!views || views <= 0) return 0;
  return price / views;
}

// Évaluation de la rentabilité basée sur le CPV
export function evaluateProfitability(cpv: number): {
  score: number; // 0-100
  rating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'FAIBLE';
} {
  // Benchmarks CPV (€/vue)
  const EXCELLENT_CPV = 0.0001; // 0.01 centime par vue
  const BON_CPV = 0.0005;       // 0.05 centime par vue
  const MOYEN_CPV = 0.001;      // 0.1 centime par vue
  const FAIBLE_CPV = 0.005;     // 0.5 centime par vue
  
  if (!cpv || cpv <= 0) {
    return { score: 0, rating: 'FAIBLE' };
  }
  
  let score: number;
  let rating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'FAIBLE';
  
  if (cpv <= EXCELLENT_CPV) {
    score = 100;
    rating = 'EXCELLENT';
  } else if (cpv <= BON_CPV) {
    score = 75 + ((BON_CPV - cpv) / (BON_CPV - EXCELLENT_CPV)) * 25;
    rating = 'BON';
  } else if (cpv <= MOYEN_CPV) {
    score = 50 + ((MOYEN_CPV - cpv) / (MOYEN_CPV - BON_CPV)) * 25;
    rating = 'MOYEN';
  } else if (cpv <= FAIBLE_CPV) {
    score = 25 + ((FAIBLE_CPV - cpv) / (FAIBLE_CPV - MOYEN_CPV)) * 25;
    rating = 'FAIBLE';
  } else {
    score = Math.max(0, 25 * (1 - (cpv - FAIBLE_CPV) / FAIBLE_CPV));
    rating = 'FAIBLE';
  }
  
  return { score: Math.round(score), rating };
}

// Calcul du ROI (Return On Investment)
export function calculateROI(
  price: number,
  views: number,
  likes: number,
  comments: number
): {
  cpv: number;
  engagement: number; // Taux d'engagement %
  roiScore: number; // 0-100
  valueGenerated: number; // Valeur estimée générée
} {
  const cpv = calculateCPV(price, views);
  
  // Engagement = (likes + comments * 2) / views * 100
  const engagement = views > 0 ? ((likes + comments * 2) / views) * 100 : 0;
  
  // Valeur générée estimée (basée sur engagement et portée)
  // 1 vue = 0.001€, 1 like = 0.01€, 1 comment = 0.05€
  const valueGenerated = views * 0.001 + likes * 0.01 + comments * 0.05;
  
  // ROI Score basé sur CPV et engagement
  const { score: cpvScore } = evaluateProfitability(cpv);
  const engagementScore = Math.min(100, engagement * 10); // 10% engagement = 100 points
  
  const roiScore = Math.round((cpvScore * 0.6 + engagementScore * 0.4));
  
  return {
    cpv,
    engagement,
    roiScore,
    valueGenerated,
  };
}
