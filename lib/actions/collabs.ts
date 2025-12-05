'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addCollaborationStats(influencerId: string, formData: FormData) {
  const title = formData.get('title') as string | null;
  const platform = formData.get('platform') as string;
  const formatType = formData.get('formatType') as string;
  const dateStr = formData.get('date') as string | null;
  const viewsStr = formData.get('views') as string | null;
  const likesStr = formData.get('likes') as string | null;
  const commentsStr = formData.get('comments') as string | null;
  const priceStr = formData.get('price') as string | null;
  const isCollab = formData.get('isCollab') === 'on';

  const date = dateStr ? new Date(dateStr) : null;
  const views = viewsStr ? parseInt(viewsStr, 10) : null;
  const likes = likesStr ? parseInt(likesStr, 10) : null;
  const comments = commentsStr ? parseInt(commentsStr, 10) : null;
  const price = priceStr ? parseFloat(priceStr) : null;

  await prisma.collaborationStats.create({
    data: {
      influencerId,
      title: title || null,
      platform,
      formatType,
      date,
      views,
      likes,
      comments,
      price,
      isCollab,
    },
  });

  revalidatePath(`/influencers/${influencerId}`);
}

export async function deleteCollaborationStats(collabId: string, influencerId: string) {
  await prisma.collaborationStats.delete({
    where: { id: collabId },
  });

  revalidatePath(`/influencers/${influencerId}`);
}
