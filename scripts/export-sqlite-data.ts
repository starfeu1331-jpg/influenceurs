/**
 * Script de migration des données SQLite vers PostgreSQL
 * 
 * Usage:
 * 1. Assurez-vous que les deux bases de données sont accessibles
 * 2. Créez un fichier .env.migration avec:
 *    SQLITE_URL="file:./prisma/dev.db"
 *    POSTGRES_URL="postgresql://user:password@host:5432/database"
 * 3. Exécutez: npx tsx scripts/migrate-sqlite-to-postgres.ts
 */

import { PrismaClient as SQLitePrismaClient } from '@prisma/client';

// Pour PostgreSQL, on devra créer un nouveau client avec la nouvelle URL
const sqliteClient = new SQLitePrismaClient({
  datasources: {
    db: {
      url: process.env.SQLITE_URL || 'file:./prisma/dev.db',
    },
  },
});

async function main() {
  console.log('🚀 Début de la migration SQLite → PostgreSQL\n');

  try {
    // 1. Export des données SQLite
    console.log('📤 Export des données depuis SQLite...');
    
    const influencers = await sqliteClient.influencer.findMany({
      include: {
        platforms: true,
        statsSnapshots: true,
        collaborationStats: true,
        scores: true,
        projects: {
          include: {
            projectCollaborationStats: true,
          },
        },
        comparisonItems: {
          include: {
            comparison: true,
          },
        },
      },
    });

    console.log(`✅ ${influencers.length} influenceurs exportés`);

    // 2. Sauvegarde dans un fichier JSON
    const fs = require('fs');
    const exportData = {
      exportDate: new Date().toISOString(),
      influencers,
    };

    const exportPath = './prisma/export-sqlite-data.json';
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
    
    console.log(`\n✅ Données exportées dans: ${exportPath}`);
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Créez votre base PostgreSQL sur Vercel ou Supabase');
    console.log('2. Mettez à jour DATABASE_URL dans .env avec la nouvelle URL PostgreSQL');
    console.log('3. Exécutez: npx prisma migrate dev --name init');
    console.log('4. Importez les données avec le script d\'import');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error);
    process.exit(1);
  } finally {
    await sqliteClient.$disconnect();
  }
}

main();
