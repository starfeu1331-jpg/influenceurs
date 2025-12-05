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

// Calcul du CPM (Coût Pour Mille vues)
export function calculateCPM(price: number, views: number): number {
  if (!views || views <= 0) return 0;
  return (price / views) * 1000;
}

// Calcul du CPE (Coût Par Engagement)
export function calculateCPE(price: number, likes: number, comments: number): number {
  const totalEngagement = likes + comments;
  if (!totalEngagement || totalEngagement <= 0) return 0;
  return price / totalEngagement;
}

// Benchmarks CPM par format (en €/1000 vues)
const CPM_BENCHMARKS: Record<string, { excellent: number; bon: number; moyen: number; mauvais: number }> = {
  // Instagram
  REEL: { excellent: 3, bon: 6, moyen: 10, mauvais: 10 },
  POST_FEED: { excellent: 8, bon: 12, moyen: 18, mauvais: 18 },
  POST_CARROUSEL: { excellent: 8, bon: 12, moyen: 18, mauvais: 18 },
  STORY: { excellent: 6, bon: 10, moyen: 15, mauvais: 15 },
  STORY_SET: { excellent: 6, bon: 10, moyen: 15, mauvais: 15 },
  
  // TikTok
  TIKTOK_VIDEO: { excellent: 2, bon: 4, moyen: 7, mauvais: 7 },
  TIKTOK_SERIE: { excellent: 2, bon: 4, moyen: 7, mauvais: 7 },
  
  // YouTube
  YOUTUBE_VIDEO: { excellent: 7, bon: 12, moyen: 20, mauvais: 20 },
  YOUTUBE_SHORT: { excellent: 7, bon: 12, moyen: 20, mauvais: 20 },
  YOUTUBE_INTEGRATION: { excellent: 9, bon: 14, moyen: 22, mauvais: 22 },
  
  // Défaut
  OTHER: { excellent: 5, bon: 10, moyen: 15, mauvais: 15 },
};

// Benchmarks CPE par format (en €/engagement)
const CPE_BENCHMARKS: Record<string, { excellent: number; bon: number; moyen: number; mauvais: number }> = {
  // Instagram
  REEL: { excellent: 0.20, bon: 0.40, moyen: 0.70, mauvais: 0.70 },
  POST_FEED: { excellent: 0.30, bon: 0.50, moyen: 0.80, mauvais: 0.80 },
  POST_CARROUSEL: { excellent: 0.30, bon: 0.50, moyen: 0.80, mauvais: 0.80 },
  STORY: { excellent: 0.15, bon: 0.30, moyen: 0.50, mauvais: 0.50 },
  STORY_SET: { excellent: 0.15, bon: 0.30, moyen: 0.50, mauvais: 0.50 },
  
  // TikTok
  TIKTOK_VIDEO: { excellent: 0.10, bon: 0.25, moyen: 0.45, mauvais: 0.45 },
  TIKTOK_SERIE: { excellent: 0.10, bon: 0.25, moyen: 0.45, mauvais: 0.45 },
  
  // YouTube
  YOUTUBE_VIDEO: { excellent: 0.40, bon: 0.80, moyen: 1.20, mauvais: 1.20 },
  YOUTUBE_SHORT: { excellent: 0.40, bon: 0.80, moyen: 1.20, mauvais: 1.20 },
  YOUTUBE_INTEGRATION: { excellent: 0.50, bon: 0.90, moyen: 1.40, mauvais: 1.40 },
  
  // Défaut
  OTHER: { excellent: 0.30, bon: 0.60, moyen: 1.00, mauvais: 1.00 },
};

// Évaluation basée sur CPM
export function evaluateCPM(cpm: number, formatType: string): {
  score: number; // 0-100
  rating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'MAUVAIS';
} {
  const benchmarks = CPM_BENCHMARKS[formatType] || CPM_BENCHMARKS.OTHER;
  
  if (!cpm || cpm <= 0) {
    return { score: 0, rating: 'MAUVAIS' };
  }
  
  let score: number;
  let rating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'MAUVAIS';
  
  if (cpm <= benchmarks.excellent) {
    score = 100;
    rating = 'EXCELLENT';
  } else if (cpm <= benchmarks.bon) {
    score = 75 + ((benchmarks.bon - cpm) / (benchmarks.bon - benchmarks.excellent)) * 25;
    rating = 'BON';
  } else if (cpm <= benchmarks.moyen) {
    score = 50 + ((benchmarks.moyen - cpm) / (benchmarks.moyen - benchmarks.bon)) * 25;
    rating = 'MOYEN';
  } else if (cpm <= benchmarks.mauvais) {
    score = 25 + ((benchmarks.mauvais - cpm) / (benchmarks.mauvais - benchmarks.moyen)) * 25;
    rating = 'MAUVAIS';
  } else {
    score = Math.max(0, 25 * (1 - (cpm - benchmarks.mauvais) / benchmarks.mauvais));
    rating = 'MAUVAIS';
  }
  
  return { score: Math.round(score), rating };
}

// Évaluation basée sur CPE
export function evaluateCPE(cpe: number, formatType: string): {
  score: number; // 0-100
  rating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'MAUVAIS';
} {
  const benchmarks = CPE_BENCHMARKS[formatType] || CPE_BENCHMARKS.OTHER;
  
  if (!cpe || cpe <= 0) {
    return { score: 0, rating: 'MAUVAIS' };
  }
  
  let score: number;
  let rating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'MAUVAIS';
  
  if (cpe <= benchmarks.excellent) {
    score = 100;
    rating = 'EXCELLENT';
  } else if (cpe <= benchmarks.bon) {
    score = 75 + ((benchmarks.bon - cpe) / (benchmarks.bon - benchmarks.excellent)) * 25;
    rating = 'BON';
  } else if (cpe <= benchmarks.moyen) {
    score = 50 + ((benchmarks.moyen - cpe) / (benchmarks.moyen - benchmarks.bon)) * 25;
    rating = 'MOYEN';
  } else if (cpe <= benchmarks.mauvais) {
    score = 25 + ((benchmarks.mauvais - cpe) / (benchmarks.mauvais - benchmarks.moyen)) * 25;
    rating = 'MAUVAIS';
  } else {
    score = Math.max(0, 25 * (1 - (cpe - benchmarks.mauvais) / benchmarks.mauvais));
    rating = 'MAUVAIS';
  }
  
  return { score: Math.round(score), rating };
}

// Calcul du ROI (Return On Investment)
export function calculateROI(
  price: number,
  views: number,
  likes: number,
  comments: number,
  formatType: string = 'OTHER'
): {
  cpm: number;
  cpe: number;
  cpmScore: number;
  cpeScore: number;
  roiScore: number; // Score combiné CPM + CPE
  cpmRating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'MAUVAIS';
  cpeRating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'MAUVAIS';
} {
  const cpm = calculateCPM(price, views);
  const cpe = calculateCPE(price, likes, comments);
  
  const { score: cpmScore, rating: cpmRating } = evaluateCPM(cpm, formatType);
  const { score: cpeScore, rating: cpeRating } = evaluateCPE(cpe, formatType);
  
  // ROI Score = 60% CPM + 40% CPE (portée > engagement)
  const roiScore = Math.round(cpmScore * 0.6 + cpeScore * 0.4);
  
  return {
    cpm,
    cpe,
    cpmScore,
    cpeScore,
    roiScore,
    cpmRating,
    cpeRating,
  };
}
