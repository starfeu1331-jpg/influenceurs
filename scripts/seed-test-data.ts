// Script pour créer des données de test
// Usage : npx tsx scripts/seed-test-data.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Création de données de test...');

  // Créer un influenceur de test
  const influencer = await prisma.influencer.create({
    data: {
      name: 'Sophie Réno',
      mainPlatform: 'INSTAGRAM',
      profileUrl: 'https://instagram.com/sophiereno',
      followers: 145000,
      location: 'Lyon, France',
      notes: 'Spécialiste rénovation et DIY',
      topicsNotes: 'Rénovation, déco intérieure, DIY, avant/après',
      audienceNotes: 'Majorité France (70%), femmes 25-45 ans, forte audience Sud',
      projectTimeline: 'Rénovation maison 2024-2025',
      fitThemeScore: 90,
      fitGeoScore: 85,
      fitTimingScore: 95,
    },
  });

  console.log('✅ Influenceur créé:', influencer.name);

  // Ajouter des stats organiques
  await prisma.statsSnapshot.createMany({
    data: [
      {
        influencerId: influencer.id,
        platform: 'INSTAGRAM',
        period: 'LAST_15_DAYS',
        avgViews: 45000,
        avgLikes: 3200,
        avgComments: 280,
      },
      {
        influencerId: influencer.id,
        platform: 'INSTAGRAM',
        period: 'LAST_30_DAYS',
        avgViews: 42000,
        avgLikes: 3000,
        avgComments: 250,
      },
      {
        influencerId: influencer.id,
        platform: 'INSTAGRAM',
        period: 'LAST_3_MONTHS',
        avgViews: 38000,
        avgLikes: 2800,
        avgComments: 220,
      },
    ],
  });

  console.log('✅ Stats organiques ajoutées');

  // Ajouter des collaborations
  await prisma.collaborationStats.createMany({
    data: [
      {
        influencerId: influencer.id,
        title: 'Collab Marque Peinture',
        platform: 'INSTAGRAM',
        formatType: 'REEL',
        date: new Date('2024-10-15'),
        views: 68000,
        likes: 4200,
        comments: 320,
        price: 2500,
        isCollab: true,
      },
      {
        influencerId: influencer.id,
        title: 'Collab Outils DIY',
        platform: 'INSTAGRAM',
        formatType: 'REEL',
        date: new Date('2024-10-28'),
        views: 52000,
        likes: 3800,
        comments: 290,
        price: 2000,
        isCollab: true,
      },
      {
        influencerId: influencer.id,
        title: 'Story Marque Déco',
        platform: 'INSTAGRAM',
        formatType: 'STORY',
        date: new Date('2024-11-05'),
        views: 28000,
        likes: 1200,
        comments: 85,
        price: 800,
        isCollab: true,
      },
    ],
  });

  console.log('✅ Collaborations ajoutées');

  // Créer un deuxième influenceur
  const influencer2 = await prisma.influencer.create({
    data: {
      name: 'Marc Brico',
      mainPlatform: 'YOUTUBE',
      profileUrl: 'https://youtube.com/@marcbrico',
      followers: 87000,
      location: 'Paris, France',
      notes: 'Tutos bricolage et rénovation',
      topicsNotes: 'Bricolage, électricité, plomberie',
      audienceNotes: 'France entière, 60% hommes 30-50 ans',
      fitThemeScore: 75,
      fitGeoScore: 80,
      fitTimingScore: 70,
    },
  });

  console.log('✅ Influenceur 2 créé:', influencer2.name);

  // Stats pour influencer 2
  await prisma.statsSnapshot.createMany({
    data: [
      {
        influencerId: influencer2.id,
        platform: 'YOUTUBE',
        period: 'LAST_30_DAYS',
        avgViews: 25000,
        avgLikes: 1800,
        avgComments: 150,
      },
    ],
  });

  // Collabs pour influencer 2
  await prisma.collaborationStats.createMany({
    data: [
      {
        influencerId: influencer2.id,
        title: 'Vidéo dédiée Outillage Pro',
        platform: 'YOUTUBE',
        formatType: 'YOUTUBE_DEDICATED',
        date: new Date('2024-11-01'),
        views: 45000,
        likes: 3200,
        comments: 280,
        price: 3500,
        isCollab: true,
      },
    ],
  });

  console.log('✅ Stats et collabs influenceur 2 ajoutées');
  console.log('\n🎉 Données de test créées avec succès !');
  console.log('👉 Allez sur http://localhost:3000 pour les voir');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
