import { prisma } from '../lib/prisma';

async function debugYoutubeStats() {
  const influencerId = 'cmit3st6z0000etv63fk6r85h';
  
  console.log('🔍 Vérification des données YouTube pour Charley et Charlotte...\n');
  
  // 1. Pricing YouTube
  const pricing = await prisma.influencerPricing.findMany({
    where: { 
      influencerId,
      formatType: { contains: 'YOUTUBE' }
    }
  });
  
  console.log('💰 PRICING YOUTUBE:');
  console.log(pricing);
  console.log('');
  
  // 2. Stats YouTube
  const stats = await prisma.statsSnapshot.findMany({
    where: { 
      influencerId,
      platform: 'YOUTUBE'
    }
  });
  
  console.log('📊 STATS YOUTUBE:');
  console.log(stats);
  console.log('');
  
  // 3. Score avec breakdown
  const score = await prisma.score.findFirst({
    where: { influencerId },
    orderBy: { computedAt: 'desc' }
  });
  
  console.log('🎯 DERNIER SCORE:');
  console.log('organicBreakdown:', score?.organicBreakdown);
  
  await prisma.$disconnect();
}

debugYoutubeStats().catch(console.error);
