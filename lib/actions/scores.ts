'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { computeInfluencerScore } from '@/lib/scoring/computeInfluencerScore';

export async function recalculateScore(influencerId: string) {
  // Charger l'influenceur et ses données
  const influencer = await prisma.influencer.findUnique({
    where: { id: influencerId },
    include: {
      platforms: true,
      pricing: true, // INCLURE les tarifs
      statsSnapshots: true,
      collaborationStats: true,
      projects: {
        include: {
          projectCollaborationStats: true,
        },
      },
    },
  });

  if (!influencer) {
    throw new Error('Influenceur introuvable');
  }

  // Agréger les stats de collaboration de tous les projets
  const projectCollabStats = influencer.projects
    .map(p => p.projectCollaborationStats)
    .filter((cs): cs is NonNullable<typeof cs> => cs !== null);

  // Combiner les stats historiques ET les stats de projets pour le scoring
  const allCollabStats = [
    ...influencer.collaborationStats,
    ...projectCollabStats.map(pcs => ({
      id: pcs.id,
      influencerId,
      title: pcs.title,
      date: pcs.publishDate,
      platform: pcs.platform,
      formatType: pcs.formatType,
      views: pcs.actualViews,
      likes: pcs.actualLikes,
      comments: pcs.actualComments,
      price: pcs.actualPrice,
      isCollab: true,
      createdAt: pcs.createdAt,
    }))
  ];

  // Calculer le score
  const computedScore = await computeInfluencerScore({
    influencer,
    statsSnapshots: influencer.statsSnapshots,
    collaborationStats: allCollabStats,
  });

  // Enregistrer le score
  await prisma.score.create({
    data: {
      influencerId,
      totalScore: computedScore.totalScore,
      impactCollabsScore: computedScore.impactCollabsScore,
      organicPotentialScore: computedScore.organicPotentialScore,
      profitabilityScore: computedScore.profitabilityScore,
      strategicFitScore: computedScore.strategicFitScore,
      weightImpactCollabs: computedScore.weightImpactCollabs,
      weightOrganicPotential: computedScore.weightOrganicPotential,
      weightProfitability: computedScore.weightProfitability,
      weightStrategicFit: computedScore.weightStrategicFit,
      estimatedViews: computedScore.estimatedViews,
      estimatedCPV: computedScore.estimatedCPV,
      roiScore: computedScore.roiScore,
    },
  });

  revalidatePath(`/influencers/${influencerId}`);
}
