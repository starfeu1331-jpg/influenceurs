'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInfluencer(formData: FormData) {
  const name = formData.get('name') as string;
  const location = formData.get('location') as string | null;
  const notes = formData.get('notes') as string | null;

  // Collecter les plateformes cochées
  const platforms = [];
  
  if (formData.get('hasInstagram') === 'on') {
    platforms.push({
      platform: 'INSTAGRAM',
      username: formData.get('instagramUsername') as string | null,
      followers: parseInt(formData.get('instagramFollowers') as string) || null,
      profileUrl: formData.get('instagramUrl') as string | null,
      isMain: formData.get('instagramIsMain') === 'on',
    });
  }
  
  if (formData.get('hasTikTok') === 'on') {
    platforms.push({
      platform: 'TIKTOK',
      username: formData.get('tiktokUsername') as string | null,
      followers: parseInt(formData.get('tiktokFollowers') as string) || null,
      profileUrl: formData.get('tiktokUrl') as string | null,
      isMain: formData.get('tiktokIsMain') === 'on',
    });
  }
  
  if (formData.get('hasYouTube') === 'on') {
    platforms.push({
      platform: 'YOUTUBE',
      username: formData.get('youtubeUsername') as string | null,
      followers: parseInt(formData.get('youtubeFollowers') as string) || null,
      profileUrl: formData.get('youtubeUrl') as string | null,
      isMain: formData.get('youtubeIsMain') === 'on',
    });
  }
  
  if (formData.get('hasOther') === 'on') {
    platforms.push({
      platform: 'OTHER',
      username: formData.get('otherUsername') as string | null,
      followers: parseInt(formData.get('otherFollowers') as string) || null,
      profileUrl: formData.get('otherUrl') as string | null,
      isMain: formData.get('otherIsMain') === 'on',
    });
  }

  // Créer l'influenceur avec ses plateformes
  const influencer = await prisma.influencer.create({
    data: {
      name,
      location: location || null,
      notes: notes || null,
      platforms: {
        create: platforms,
      },
    },
  });

  redirect(`/influencers/${influencer.id}`);
}

export async function updateInfluencerPlatforms(formData: FormData) {
  const influencerId = formData.get('influencerId') as string;
  
  // Supprimer toutes les plateformes existantes
  await prisma.influencerPlatform.deleteMany({
    where: { influencerId },
  });

  // Collecter les nouvelles plateformes
  const platforms = [];
  
  if (formData.get('instagram-enabled') === 'on') {
    platforms.push({
      platform: 'INSTAGRAM',
      username: formData.get('instagram-username') as string | null,
      followers: parseInt(formData.get('instagram-followers') as string) || null,
      profileUrl: formData.get('instagram-url') as string | null,
      isMain: formData.get('main-platform') === 'instagram',
    });
  }
  
  if (formData.get('tiktok-enabled') === 'on') {
    platforms.push({
      platform: 'TIKTOK',
      username: formData.get('tiktok-username') as string | null,
      followers: parseInt(formData.get('tiktok-followers') as string) || null,
      profileUrl: formData.get('tiktok-url') as string | null,
      isMain: formData.get('main-platform') === 'tiktok',
    });
  }
  
  if (formData.get('youtube-enabled') === 'on') {
    platforms.push({
      platform: 'YOUTUBE',
      username: formData.get('youtube-username') as string | null,
      followers: parseInt(formData.get('youtube-followers') as string) || null,
      profileUrl: formData.get('youtube-url') as string | null,
      isMain: formData.get('main-platform') === 'youtube',
    });
  }
  
  if (formData.get('other-enabled') === 'on') {
    platforms.push({
      platform: 'OTHER',
      username: formData.get('other-username') as string | null,
      followers: parseInt(formData.get('other-followers') as string) || null,
      profileUrl: formData.get('other-url') as string | null,
      isMain: formData.get('main-platform') === 'other',
    });
  }

  // Créer les nouvelles plateformes
  await prisma.influencer.update({
    where: { id: influencerId },
    data: {
      platforms: {
        create: platforms,
      },
    },
  });

  revalidatePath(`/influencers/${influencerId}`);
  revalidatePath('/influencers');
}

export async function updateInfluencerFit(influencerId: string, formData: FormData) {
  const topicsNotes = formData.get('topicsNotes') as string | null;
  const audienceNotes = formData.get('audienceNotes') as string | null;
  const projectTimeline = formData.get('projectTimeline') as string | null;
  const fitThemeScoreStr = formData.get('fitThemeScore') as string | null;
  const fitGeoScoreStr = formData.get('fitGeoScore') as string | null;
  const fitTimingScoreStr = formData.get('fitTimingScore') as string | null;

  const fitThemeScore = fitThemeScoreStr ? parseInt(fitThemeScoreStr, 10) : null;
  const fitGeoScore = fitGeoScoreStr ? parseInt(fitGeoScoreStr, 10) : null;
  const fitTimingScore = fitTimingScoreStr ? parseInt(fitTimingScoreStr, 10) : null;

  await prisma.influencer.update({
    where: { id: influencerId },
    data: {
      topicsNotes: topicsNotes || null,
      audienceNotes: audienceNotes || null,
      projectTimeline: projectTimeline || null,
      fitThemeScore,
      fitGeoScore,
      fitTimingScore,
    },
  });

  revalidatePath(`/influencers/${influencerId}`);
}
