'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type CollaborationStatsInput = {
  projectId: string;
  title?: string;
  platform: string;
  formatType: string;
  publishDate?: Date;
  actualViews?: number;
  actualLikes?: number;
  actualComments?: number;
  actualPrice?: number;
};

/**
 * Ajouter ou mettre à jour les stats de collaboration d'un projet
 * Calcule automatiquement les variances et recommandations
 */
export async function updateCollaborationStats(input: CollaborationStatsInput) {
  try {
    // Récupérer le projet avec ses prédictions
    const project = await prisma.project.findUnique({
      where: { id: input.projectId },
      include: { influencer: true },
    });

    if (!project) {
      return { success: false, error: 'Projet introuvable' };
    }

    // Calculer CPV réel
    const actualCPV =
      input.actualViews && input.actualPrice && input.actualViews > 0
        ? input.actualPrice / input.actualViews
        : undefined;

    // Calculer les variances si prédictions disponibles
    let viewsVariance: number | undefined;
    let likesVariance: number | undefined;
    let commentsVariance: number | undefined;
    let cpvVariance: number | undefined;

    if (project.predictedViews && input.actualViews) {
      viewsVariance = ((input.actualViews - project.predictedViews) / project.predictedViews) * 100;
    }

    if (project.predictedLikes && input.actualLikes) {
      likesVariance = ((input.actualLikes - project.predictedLikes) / project.predictedLikes) * 100;
    }

    if (project.predictedComments && input.actualComments) {
      commentsVariance =
        ((input.actualComments - project.predictedComments) / project.predictedComments) * 100;
    }

    if (project.predictedCPV && actualCPV) {
      cpvVariance = ((actualCPV - project.predictedCPV) / project.predictedCPV) * 100;
    }

    // Déterminer performance rating et recommandation
    let performanceRating = 'MOYEN';
    let recommendRecollab = true;

    // Logique de scoring basée sur les variances
    if (viewsVariance !== undefined && cpvVariance !== undefined) {
      if (viewsVariance > 20 && cpvVariance < -10) {
        performanceRating = 'EXCELLENT';
        recommendRecollab = true;
      } else if (viewsVariance > 5 && cpvVariance < 5) {
        performanceRating = 'BON';
        recommendRecollab = true;
      } else if (viewsVariance < -15 || cpvVariance > 20) {
        performanceRating = 'DECEVANT';
        recommendRecollab = false;
      } else {
        performanceRating = 'MOYEN';
        recommendRecollab = viewsVariance > -10;
      }
    } else {
      // Si pas assez de données pour comparer, on reste neutre
      performanceRating = 'MOYEN';
      recommendRecollab = true;
    }

    // Créer ou mettre à jour les stats
    const stats = await prisma.projectCollaborationStats.upsert({
      where: { projectId: input.projectId },
      create: {
        projectId: input.projectId,
        title: input.title || project.name,
        platform: input.platform,
        formatType: input.formatType,
        publishDate: input.publishDate,
        actualViews: input.actualViews,
        actualLikes: input.actualLikes,
        actualComments: input.actualComments,
        actualPrice: input.actualPrice,
        actualCPV,
        viewsVariance,
        likesVariance,
        commentsVariance,
        cpvVariance,
        performanceRating,
        recommendRecollab,
      },
      update: {
        title: input.title || project.name,
        platform: input.platform,
        formatType: input.formatType,
        publishDate: input.publishDate,
        actualViews: input.actualViews,
        actualLikes: input.actualLikes,
        actualComments: input.actualComments,
        actualPrice: input.actualPrice,
        actualCPV,
        viewsVariance,
        likesVariance,
        commentsVariance,
        cpvVariance,
        performanceRating,
        recommendRecollab,
      },
    });

    // Si le projet n'est pas déjà terminé, le passer à TERMINE
    if (project.status !== 'TERMINE') {
      await prisma.project.update({
        where: { id: input.projectId },
        data: {
          status: 'TERMINE',
          actualEndDate: input.publishDate || new Date(),
        },
      });
    }

    revalidatePath(`/projects/${input.projectId}`);
    revalidatePath('/projects/pipeline');
    revalidatePath(`/influencers/${project.influencerId}`);

    return { success: true, stats };
  } catch (error) {
    console.error('Erreur mise à jour stats collaboration:', error);
    return { success: false, error: 'Erreur lors de la mise à jour des stats' };
  }
}

/**
 * Supprimer les stats de collaboration
 */
export async function deleteCollaborationStats(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return { success: false, error: 'Projet introuvable' };
    }

    await prisma.projectCollaborationStats.delete({
      where: { projectId },
    });

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/influencers/${project.influencerId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur suppression stats:', error);
    return { success: false, error: 'Erreur lors de la suppression des stats' };
  }
}

/**
 * Obtenir l'historique des collaborations terminées avec un influenceur
 */
export async function getInfluencerCollaborationHistory(influencerId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        influencerId,
        status: 'TERMINE',
      },
      include: {
        projectCollaborationStats: true,
      },
      orderBy: {
        actualEndDate: 'desc',
      },
    });

    return { success: true, projects };
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    return { success: false, error: "Erreur lors de la récupération de l'historique" };
  }
}

/**
 * Calculer les métriques globales de performance pour un influenceur
 */
export async function calculateInfluencerPerformanceMetrics(influencerId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        influencerId,
        status: 'TERMINE',
      },
      include: {
        projectCollaborationStats: true,
      },
    });

    if (projects.length === 0) {
      return {
        success: true,
        metrics: {
          totalCollaborations: 0,
          avgViewsVariance: 0,
          avgCpvVariance: 0,
          excellentCount: 0,
          bonCount: 0,
          moyenCount: 0,
          decevantCount: 0,
          recommendRecollab: false,
        },
      };
    }

    const stats = projects
      .map((p) => p.projectCollaborationStats)
      .filter((s) => s !== null) as NonNullable<typeof projects[0]['projectCollaborationStats']>[];

    const totalCollaborations = stats.length;
    
    const avgViewsVariance =
      stats.reduce((sum, s) => sum + (s.viewsVariance || 0), 0) / totalCollaborations;
    
    const avgCpvVariance =
      stats.reduce((sum, s) => sum + (s.cpvVariance || 0), 0) / totalCollaborations;

    const excellentCount = stats.filter((s) => s.performanceRating === 'EXCELLENT').length;
    const bonCount = stats.filter((s) => s.performanceRating === 'BON').length;
    const moyenCount = stats.filter((s) => s.performanceRating === 'MOYEN').length;
    const decevantCount = stats.filter((s) => s.performanceRating === 'DECEVANT').length;

    // Recommander recollab si > 50% des collabs sont EXCELLENT ou BON
    const goodCollabs = excellentCount + bonCount;
    const recommendRecollab = goodCollabs / totalCollaborations >= 0.5;

    return {
      success: true,
      metrics: {
        totalCollaborations,
        avgViewsVariance,
        avgCpvVariance,
        excellentCount,
        bonCount,
        moyenCount,
        decevantCount,
        recommendRecollab,
      },
    };
  } catch (error) {
    console.error('Erreur calcul métriques performance:', error);
    return { success: false, error: 'Erreur lors du calcul des métriques' };
  }
}
