'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Créer une nouvelle comparaison
 */
export async function createComparison(name: string, influencerIds: string[]) {
  try {
    if (influencerIds.length < 2 || influencerIds.length > 5) {
      return {
        success: false,
        error: 'Vous devez sélectionner entre 2 et 5 influenceurs',
      };
    }

    const comparison = await prisma.comparison.create({
      data: {
        name,
        items: {
          create: influencerIds.map((id) => ({
            influencerId: id,
          })),
        },
      },
      include: {
        items: {
          include: {
            influencer: {
              include: {
                scores: {
                  orderBy: { computedAt: 'desc' },
                  take: 1,
                },
                statsSnapshots: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
                projects: {
                  where: {
                    status: 'TERMINE',
                  },
                  include: {
                    projectCollaborationStats: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    revalidatePath('/influencers/compare');

    return { success: true, comparison };
  } catch (error) {
    console.error('Erreur création comparaison:', error);
    return { success: false, error: 'Erreur lors de la création de la comparaison' };
  }
}

/**
 * Obtenir toutes les comparaisons
 */
export async function getComparisons() {
  try {
    const comparisons = await prisma.comparison.findMany({
      include: {
        items: {
          include: {
            influencer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, comparisons };
  } catch (error) {
    console.error('Erreur récupération comparaisons:', error);
    return { success: false, error: 'Erreur lors de la récupération des comparaisons' };
  }
}

/**
 * Obtenir une comparaison par ID avec toutes les données nécessaires
 */
export async function getComparisonById(id: string) {
  try {
    const comparison = await prisma.comparison.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            influencer: {
              include: {
                scores: {
                  orderBy: { computedAt: 'desc' },
                  take: 1,
                },
                statsSnapshots: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
                projects: {
                  where: {
                    status: 'TERMINE',
                  },
                  include: {
                    projectCollaborationStats: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!comparison) {
      return { success: false, error: 'Comparaison introuvable' };
    }

    return { success: true, comparison };
  } catch (error) {
    console.error('Erreur récupération comparaison:', error);
    return { success: false, error: 'Erreur lors de la récupération de la comparaison' };
  }
}

/**
 * Supprimer une comparaison
 */
export async function deleteComparison(id: string) {
  try {
    await prisma.comparison.delete({
      where: { id },
    });

    revalidatePath('/influencers/compare');

    return { success: true };
  } catch (error) {
    console.error('Erreur suppression comparaison:', error);
    return { success: false, error: 'Erreur lors de la suppression de la comparaison' };
  }
}

/**
 * Analyser et recommander le meilleur influenceur parmi une sélection
 */
export type ComparisonRecommendation = {
  influencerId: string;
  influencerName: string;
  score: number;
  reasons: string[];
  warnings: string[];
};

export async function analyzeAndRecommend(influencerIds: string[]): Promise<{
  success: boolean;
  recommendations?: ComparisonRecommendation[];
  error?: string;
}> {
  try {
    const influencers = await prisma.influencer.findMany({
      where: {
        id: { in: influencerIds },
      },
      include: {
        scores: {
          orderBy: { computedAt: 'desc' },
          take: 1,
        },
        statsSnapshots: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        projects: {
          where: {
            status: 'TERMINE',
          },
          include: {
            projectCollaborationStats: true,
          },
        },
      },
    });

    const recommendations: ComparisonRecommendation[] = influencers.map((influencer) => {
      const latestScore = influencer.scores[0];
      const latestStats = influencer.statsSnapshots[0];
      const completedProjects = influencer.projects;

      const reasons: string[] = [];
      const warnings: string[] = [];
      let score = 0;

      // Score basé sur le score total
      if (latestScore) {
        score += latestScore.totalScore * 0.4; // 40% du poids
        if (latestScore.totalScore >= 80) {
          reasons.push(`Excellent score global (${latestScore.totalScore.toFixed(0)}/100)`);
        } else if (latestScore.totalScore < 50) {
          warnings.push(`Score global faible (${latestScore.totalScore.toFixed(0)}/100)`);
        }
      } else {
        warnings.push('Aucun score calculé');
      }

      // Score basé sur le fit stratégique
      if (influencer.fitThemeScore) {
        score += (influencer.fitThemeScore / 100) * 20; // 20% du poids
        if (influencer.fitThemeScore >= 90) {
          reasons.push(`Excellent fit thématique (${influencer.fitThemeScore}/100)`);
        }
      }

      // Score basé sur l'historique de collaboration
      if (completedProjects.length > 0) {
        const avgPerformance =
          completedProjects.reduce((sum, p) => {
            const stats = p.projectCollaborationStats;
            if (!stats) return sum;
            
            // Score de performance: EXCELLENT=4, BON=3, MOYEN=2, DECEVANT=1
            const perfScore =
              stats.performanceRating === 'EXCELLENT'
                ? 4
                : stats.performanceRating === 'BON'
                ? 3
                : stats.performanceRating === 'MOYEN'
                ? 2
                : 1;
            return sum + perfScore;
          }, 0) / completedProjects.length;

        score += (avgPerformance / 4) * 25; // 25% du poids

        const excellentCount = completedProjects.filter(
          (p) => p.projectCollaborationStats?.performanceRating === 'EXCELLENT'
        ).length;

        if (excellentCount > 0) {
          reasons.push(
            `${excellentCount} collaboration${excellentCount > 1 ? 's' : ''} excellente${excellentCount > 1 ? 's' : ''}`
          );
        }

        const decevantCount = completedProjects.filter(
          (p) => p.projectCollaborationStats?.performanceRating === 'DECEVANT'
        ).length;

        if (decevantCount > 0) {
          warnings.push(
            `${decevantCount} collaboration${decevantCount > 1 ? 's' : ''} décevante${decevantCount > 1 ? 's' : ''}`
          );
        }
      } else {
        warnings.push('Aucune collaboration passée');
        score += 10; // Score neutre de 10/25 si pas d'historique
      }

      // Score basé sur l'engagement
      if (latestStats && latestStats.avgViews && latestStats.avgLikes) {
        const engagementRate = (latestStats.avgLikes / latestStats.avgViews) * 100;
        score += Math.min(engagementRate * 3, 15); // Max 15% du poids

        if (engagementRate >= 8) {
          reasons.push(`Taux d'engagement élevé (${engagementRate.toFixed(1)}%)`);
        } else if (engagementRate < 3) {
          warnings.push(`Taux d'engagement faible (${engagementRate.toFixed(1)}%)`);
        }
      }

      return {
        influencerId: influencer.id,
        influencerName: influencer.name,
        score: Math.round(score),
        reasons,
        warnings,
      };
    });

    // Trier par score décroissant
    recommendations.sort((a, b) => b.score - a.score);

    return { success: true, recommendations };
  } catch (error) {
    console.error('Erreur analyse recommandations:', error);
    return { success: false, error: "Erreur lors de l'analyse" };
  }
}
