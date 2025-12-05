'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addStatsSnapshot(influencerId: string, formData: FormData) {
  const platform = formData.get('platform') as string;
  const formatType = formData.get('formatType') as string;
  const period = formData.get('period') as string;
  const avgViewsStr = formData.get('avgViews') as string | null;
  const avgLikesStr = formData.get('avgLikes') as string | null;
  const avgCommentsStr = formData.get('avgComments') as string | null;

  const avgViews = avgViewsStr ? parseInt(avgViewsStr, 10) : null;
  const avgLikes = avgLikesStr ? parseInt(avgLikesStr, 10) : null;
  const avgComments = avgCommentsStr ? parseInt(avgCommentsStr, 10) : null;

  await prisma.statsSnapshot.create({
    data: {
      influencerId,
      platform,
      formatType,
      period,
      avgViews,
      avgLikes,
      avgComments,
    },
  });

  revalidatePath(`/influencers/${influencerId}`);
}

export async function deleteStatsSnapshot(snapshotId: string, influencerId: string) {
  await prisma.statsSnapshot.delete({
    where: { id: snapshotId },
  });

  revalidatePath(`/influencers/${influencerId}`);
}
