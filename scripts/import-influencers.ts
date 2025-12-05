import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Début de l\'importation des influenceurs...\n');

  // Alexia White
  const alexia = await prisma.influencer.create({
    data: {
      name: 'Alexia White',
      notes: 'Rénovation - Couple avec Pierro',
      platforms: {
        create: [
          {
            platform: 'TIKTOK',
            followers: 94360,
            profileUrl: '@alexiawhite',
            isMain: true,
          },
          {
            platform: 'FACEBOOK',
            followers: 45981,
            profileUrl: 'Alexia white',
            isMain: false,
          },
          {
            platform: 'INSTAGRAM',
            followers: 17229,
            profileUrl: '@alexiawhite',
            isMain: false,
          },
          {
            platform: 'YOUTUBE',
            followers: 5832,
            profileUrl: 'Alexia & Pierro - Rénovation',
            isMain: false,
          },
        ],
      },
    },
  });
  console.log('✅ Alexia White créée');

  // Ariane (Tableau de bord professionnel)
  const ariane = await prisma.influencer.create({
    data: {
      name: 'Ariane',
      notes: 'Tableau de bord professionnel - Rénovation/Déco',
      platforms: {
        create: [
          {
            platform: 'INSTAGRAM',
            followers: 118734,
            profileUrl: '@ariane',
            isMain: true,
          },
          {
            platform: 'TIKTOK',
            followers: 30610,
            profileUrl: '@ariane',
            isMain: false,
          },
        ],
      },
    },
  });
  console.log('✅ Ariane créée');

  // Aurelia (Villa Mahana Cassis)
  const aurelia = await prisma.influencer.create({
    data: {
      name: 'Aurelia',
      notes: 'Villa Mahana Cassis - Rénovation',
      platforms: {
        create: [
          {
            platform: 'INSTAGRAM',
            followers: 118734,
            profileUrl: '@villamahanacassis',
            isMain: true,
          },
          {
            platform: 'TIKTOK',
            followers: 30610,
            profileUrl: '@villamahanacassis',
            isMain: false,
          },
        ],
      },
    },
  });
  console.log('✅ Aurelia (Villa Mahana Cassis) créée');

  // Autodidacte - Gaël
  const gael = await prisma.influencer.create({
    data: {
      name: 'Gaël',
      notes: 'Autodidacte - Bricolage/Rénovation',
      platforms: {
        create: [
          {
            platform: 'TIKTOK',
            followers: 37581,
            profileUrl: '@autodidacte',
            isMain: true,
          },
        ],
      },
    },
  });
  console.log('✅ Autodidacte - Gaël créé');

  console.log('\n🎉 Importation terminée avec succès !');
  console.log(`📊 ${4} influenceurs créés`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
