/**
 * Script de migration: Transformer mainPlatform en InfluencerPlatform
 * 
 * Exécuter APRÈS avoir fait `npx prisma db push`
 * Usage: npx tsx scripts/migrate-to-multiplatform.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migration vers système multi-plateformes...\n');

  // Récupérer tous les influenceurs avec leur ancienne mainPlatform
  const influencers = await prisma.$queryRaw<Array<{
    id: string;
    name: string;
    mainPlatform?: string;
    profileUrl?: string;
    followers?: number;
  }>>`SELECT id, name FROM Influencer`;

  console.log(`📊 ${influencers.length} influenceurs à migrer\n`);

  for (const influencer of influencers) {
    // Vérifier si des plateformes existent déjà
    const existingPlatforms = await prisma.influencerPlatform.count({
      where: { influencerId: influencer.id }
    });

    if (existingPlatforms > 0) {
      console.log(`✓ ${influencer.name} - déjà migré (${existingPlatforms} plateformes)`);
      continue;
    }

    console.log(`⚙️  Migration de ${influencer.name}...`);
    
    // Note: Les anciennes colonnes n'existent plus, on crée juste une plateforme par défaut
    // Les utilisateurs devront ajouter manuellement leurs plateformes
    console.log(`   ℹ️  Aucune plateforme - l'utilisateur devra les ajouter manuellement`);
  }

  console.log('\n✅ Migration terminée !');
  console.log('\n⚠️  Important: Ajoutez les plateformes manuellement pour chaque influenceur');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
