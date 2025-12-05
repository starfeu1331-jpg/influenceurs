const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');

// Mapping des dossiers vers les influenceurs
const INFLUENCER_MAPPING = {
  'harold insta': { name: 'Jore Jardin (Harold)', platform: 'INSTAGRAM' },
  'HAROLD TIKTOK': { name: 'Jore Jardin (Harold)', platform: 'TIKTOK' },
  'INSTA AURELIA': { name: 'Aurelia (Villa Mahana Cassis)', platform: 'INSTAGRAM' },
  'TIKTOK AURELIA': { name: 'Aurelia (Villa Mahana Cassis)', platform: 'TIKTOK' },
  'Stats-réseaux': { name: 'Mathilde Menier', platform: 'INSTAGRAM' },
  'stats yann youtube': { name: 'Yann (Petit Copeau)', platform: 'YOUTUBE' },
  'STATS OLIVIA DEC': { name: 'Olivia (Mum Dalma)', platform: 'INSTAGRAM' },
  'pdf24_converted 3': { name: 'Benjamin', platform: 'INSTAGRAM' },
  'pdf24_converted 4': { name: 'Benjamin', platform: 'YOUTUBE' },
  'stats renovateurs du dimanche novembre 2025': { name: 'Rénovateurs du Dimanche (Ange et Violette)', platform: 'INSTAGRAM' },
  'STATS INSTAGRAM BRICOMONT': { name: 'Marie Lys (Bricomont)', platform: 'INSTAGRAM' },
  'STATS TIKTOK BRICOMONT': { name: 'Marie Lys (Bricomont)', platform: 'TIKTOK' },
  'YOUTUBE MARC & SANDY': { name: 'Marc & Sandy', platform: 'YOUTUBE' },
  'youtube aladdin': { name: 'Aladdin', platform: 'YOUTUBE' },
  'STATS INSTA': { name: 'Aladdin', platform: 'INSTAGRAM' },
  'Youtube Statistiques 1 (7)': { name: 'Charley et Charlotte', platform: 'YOUTUBE' },
  'STATS INSTA TED': { name: 'Ted & Lisa', platform: 'INSTAGRAM' },
  'STATS GUILLAUME': { name: 'Rénovaventure (Guillaume)', platform: 'INSTAGRAM' },
};

const VINCENT_DEBO = {
  name: 'Vincent et Déborah',
  platforms: [
    { platform: 'INSTAGRAM', folder: 'VINCENT ET DEBO ✅✨' }
  ]
};

function extractNumber(text) {
  // Chercher des patterns comme "145K", "1.2M", "50 000"
  const patterns = [
    /(\d+[\.,]?\d*)\s*[Mm]illion/gi,
    /(\d+[\.,]?\d*)\s*M(?![a-z])/gi,
    /(\d+[\.,]?\d*)\s*[Kk]/gi,
    /(\d[\d\s]{3,})/g,
  ];
  
  const numbers = [];
  
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      let numStr = match[1].replace(/\s/g, '').replace(',', '.');
      let num = parseFloat(numStr);
      
      if (match[0].match(/[Mm]/)) {
        num *= 1000000;
      } else if (match[0].match(/[Kk]/)) {
        num *= 1000;
      }
      
      if (num >= 1000) {
        numbers.push(Math.round(num));
      }
    }
  }
  
  return numbers.length > 0 ? Math.max(...numbers) : null;
}

async function extractStatsFromImage(imagePath) {
  try {
    console.log(`   📷 Lecture: ${path.basename(imagePath)}`);
    
    const { data: { text } } = await Tesseract.recognize(imagePath, 'fra', {
      logger: () => {} // Désactiver les logs verbeux
    });
    
    const followers = extractNumber(text);
    
    return { text, followers };
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return null;
  }
}

async function scanFolder(folderPath, folderName) {
  try {
    const files = await fs.readdir(folderPath);
    const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
    
    if (pngFiles.length === 0) return null;
    
    // Prendre la première image (souvent le résumé)
    const firstPng = path.join(folderPath, pngFiles[0]);
    const stats = await extractStatsFromImage(firstPng);
    
    return stats;
  } catch (error) {
    console.error(`   ❌ Erreur dossier: ${error.message}`);
    return null;
  }
}

async function scanVincentDebo() {
  const vincentPath = path.join(__dirname, '../data-import/POUR INFLU/STATS CRÉATEURS DÉCEMBRE/VINCENT ET DEBO ✅✨');
  
  try {
    const stats = await scanFolder(vincentPath, 'VINCENT ET DEBO');
    
    if (stats && stats.followers) {
      return {
        name: 'Vincent et Déborah',
        platforms: [{
          platform: 'INSTAGRAM',
          followers: stats.followers,
          isMain: true
        }]
      };
    }
  } catch (error) {
    console.error(`❌ Vincent et Déborah: ${error.message}`);
  }
  
  return null;
}

async function main() {
  console.log('🚀 Extraction automatique des stats depuis les PNG...\n');
  
  const pngDir = path.join(__dirname, '../data-import/POUR INFLU/PNG');
  const influencers = {};
  
  // Scanner Vincent et Déborah d'abord
  console.log('📂 Vincent et Déborah');
  const vincentData = await scanVincentDebo();
  if (vincentData) {
    influencers[vincentData.name] = vincentData;
    console.log(`   ✅ Instagram: ${vincentData.platforms[0].followers.toLocaleString()} followers\n`);
  }
  
  // Scanner les autres dossiers
  for (const [folderName, mapping] of Object.entries(INFLUENCER_MAPPING)) {
    console.log(`📂 ${folderName}`);
    
    const folderPath = path.join(pngDir, folderName);
    const stats = await scanFolder(folderPath, folderName);
    
    if (stats && stats.followers) {
      const { name, platform } = mapping;
      
      if (!influencers[name]) {
        influencers[name] = {
          name,
          platforms: []
        };
      }
      
      influencers[name].platforms.push({
        platform,
        followers: stats.followers,
        isMain: influencers[name].platforms.length === 0
      });
      
      console.log(`   ✅ ${platform}: ${stats.followers.toLocaleString()} followers`);
    } else {
      console.log(`   ⚠️  Aucune stat extraite`);
    }
    
    console.log();
  }
  
  // Sauvegarder le résultat
  const outputFile = path.join(__dirname, '../data-import/extracted-influencers.json');
  await fs.writeFile(
    outputFile,
    JSON.stringify(Object.values(influencers), null, 2),
    'utf8'
  );
  
  console.log(`\n✅ Extraction terminée: ${Object.keys(influencers).length} influenceurs`);
  console.log(`📄 Fichier: ${outputFile}\n`);
  
  // Afficher le résumé
  console.log('📊 RÉSUMÉ:\n');
  for (const inf of Object.values(influencers)) {
    console.log(`${inf.name}:`);
    for (const p of inf.platforms) {
      const mainIndicator = p.isMain ? ' (principale)' : '';
      console.log(`  • ${p.platform}: ${p.followers.toLocaleString()} followers${mainIndicator}`);
    }
    console.log();
  }
}

main().catch(console.error);
