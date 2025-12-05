import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Données réalistes d'influenceurs
const influencersData = [
  {
    name: 'Siham Azouggagh',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/sisiazou',
    email: 'sisiazou4@gmail.com',
    phone: '06 52 31 59 23',
    followers: 125000,
    location: 'Paris, France',
    notes: 'Famille / Mère / Autisme & Handicap. Très engagée, audience fidèle.',
    topicsNotes: 'Famille, maternité, inclusion, produits maison',
    audienceNotes: '85% femmes 25-45 ans, CSP moyenne-haute',
    projectTimeline: 'Disponible immédiatement',
    fitThemeScore: 95,
    fitGeoScore: 100,
    fitTimingScore: 90,
  },
  {
    name: 'Laura (@laura_gmua)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/laura_gmua',
    email: 'Laura_gmua@yahoo.com',
    phone: '06 41 96 73 80',
    followers: 85000,
    location: 'Lyon, France',
    topicsNotes: 'Beauté, lifestyle, déco intérieure',
    audienceNotes: '90% femmes 20-40 ans',
    fitThemeScore: 88,
    fitGeoScore: 95,
    fitTimingScore: 85,
  },
  {
    name: 'Emma (@Freundicouture)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/freundicouture',
    followers: 52000,
    location: 'Bordeaux, France',
    notes: 'DIY, couture, déco fait main',
    topicsNotes: 'Couture, DIY, créativité, décoration',
    audienceNotes: '95% femmes 25-50 ans, très engagées',
    fitThemeScore: 92,
    fitGeoScore: 90,
    fitTimingScore: 80,
  },
  {
    name: 'Sabrina (@casa_babouchka)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/casa_babouchka',
    followers: 68000,
    location: 'Marseille, France',
    topicsNotes: 'Home staging, décoration, rénovation',
    audienceNotes: '80% femmes 30-55 ans',
    fitThemeScore: 98,
    fitGeoScore: 85,
    fitTimingScore: 75,
  },
  {
    name: 'Olivier Petibon',
    mainPlatform: 'YOUTUBE',
    email: 'olivier@hey-talentcy.com',
    followers: 145000,
    location: 'Paris, France',
    notes: 'Agence de talents - Contact professionnel uniquement',
    topicsNotes: 'Business, marketing, entrepreneuriat',
    audienceNotes: '60% hommes 25-45 ans',
    fitThemeScore: 45,
    fitGeoScore: 100,
    fitTimingScore: 60,
  },
  {
    name: 'Anaïs Papadopoulos (@jb.ninis.renovation)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/jb.ninis.renovation',
    followers: 42000,
    location: 'Toulouse, France',
    topicsNotes: 'Rénovation, avant-après, home staging',
    audienceNotes: '75% femmes 28-50 ans',
    fitThemeScore: 94,
    fitGeoScore: 80,
    fitTimingScore: 70,
  },
  {
    name: 'Fabien Sanz',
    mainPlatform: 'INSTAGRAM',
    email: 'fabien.sanz@skeepers.io',
    followers: 28000,
    location: 'Nice, France',
    notes: 'Agence - Refusé précédemment',
    topicsNotes: 'Marketing digital',
    fitThemeScore: 30,
    fitGeoScore: 75,
    fitTimingScore: 40,
  },
  {
    name: 'lequatrefeuilles',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/lequatrefeuilles',
    followers: 95000,
    location: 'Nantes, France',
    topicsNotes: 'Famille nombreuse, lifestyle, produits quotidiens',
    audienceNotes: '88% femmes 25-45 ans',
    fitThemeScore: 87,
    fitGeoScore: 85,
    fitTimingScore: 80,
  },
  {
    name: 'casadesecureuils',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/casadesecureuils',
    followers: 78000,
    location: 'Lille, France',
    topicsNotes: 'Maison cosy, décoration intérieure, produits maison',
    audienceNotes: '92% femmes 30-55 ans',
    fitThemeScore: 96,
    fitGeoScore: 88,
    fitTimingScore: 85,
  },
  {
    name: 'Marchitti PAYSAGE',
    mainPlatform: 'TIKTOK',
    profileUrl: 'https://www.tiktok.com/@260storys',
    email: 'contact@marchittipaysage.fr',
    phone: '03.87.73.31.13',
    followers: 180000,
    location: 'Metz, France',
    notes: 'Partenaire professionnel - Paysagiste',
    topicsNotes: 'Jardinage, extérieur, paysages',
    audienceNotes: '55% hommes 30-60 ans',
    fitThemeScore: 65,
    fitGeoScore: 70,
    fitTimingScore: 75,
  },
  {
    name: 'Élie & Alex (@lagrangedeliliealex)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/lagrangedeliliealex',
    email: 'lagrangedeliliealex@gmail.com',
    phone: '0679617587',
    followers: 112000,
    location: 'Strasbourg, France',
    topicsNotes: 'Rénovation grange, DIY, couple créatif',
    audienceNotes: '70% femmes 25-50 ans',
    fitThemeScore: 93,
    fitGeoScore: 82,
    fitTimingScore: 88,
  },
  {
    name: 'Charlotte (@chanala10)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/chanala10',
    email: 'chanala10insta@gmail.com',
    followers: 64000,
    location: 'Rennes, France',
    topicsNotes: 'Mode, beauté, lifestyle urbain',
    audienceNotes: '95% femmes 18-35 ans',
    fitThemeScore: 72,
    fitGeoScore: 80,
    fitTimingScore: 70,
  },
  {
    name: 'Pierre & Phil (@3housesereno)',
    mainPlatform: 'INSTAGRAM',
    email: '3housesereno.collaboration@gmail.com',
    phone: '0667909441',
    followers: 135000,
    location: 'Montpellier, France',
    topicsNotes: 'Rénovation, architecture, design',
    audienceNotes: '65% femmes 28-55 ans',
    fitThemeScore: 97,
    fitGeoScore: 86,
    fitTimingScore: 92,
  },
  {
    name: 'Laurine & Thomas (l)',
    mainPlatform: 'INSTAGRAM',
    email: 'laurine_mn@outlook.fr',
    followers: 48000,
    location: 'Angers, France',
    topicsNotes: 'Jeune couple, premier appart, lifestyle',
    audienceNotes: '85% femmes 22-38 ans',
    fitThemeScore: 81,
    fitGeoScore: 78,
    fitTimingScore: 75,
  },
  {
    name: 'Raphaël (@raphrenov)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/raphrenov',
    followers: 91000,
    location: 'Paris, France',
    topicsNotes: 'Rénovation appartement parisien, avant-après',
    audienceNotes: '58% femmes 25-45 ans',
    fitThemeScore: 89,
    fitGeoScore: 100,
    fitTimingScore: 83,
  },
  {
    name: 'Emma Castanie',
    mainPlatform: 'INSTAGRAM',
    followers: 35000,
    location: 'Toulouse, France',
    notes: 'Influenceur UGC - Refusé',
    topicsNotes: 'UGC générique',
    fitThemeScore: 40,
    fitGeoScore: 80,
    fitTimingScore: 50,
  },
  {
    name: 'Mathieu Richard',
    mainPlatform: 'INSTAGRAM',
    email: 'mathieurichard@levelupagency.fr',
    followers: 156000,
    location: 'Paris, France',
    topicsNotes: 'Tech, innovation, lifestyle premium',
    audienceNotes: '52% hommes 25-45 ans',
    fitThemeScore: 55,
    fitGeoScore: 100,
    fitTimingScore: 65,
  },
  {
    name: 'Pastel Media - Capucine Almeida',
    mainPlatform: 'YOUTUBE',
    email: 'capucine@capstrategie.com',
    phone: '06 12 19 07 95',
    followers: 220000,
    location: 'Paris, France',
    notes: 'Média / Agence - Refusé',
    topicsNotes: 'Média corporate',
    fitThemeScore: 25,
    fitGeoScore: 100,
    fitTimingScore: 30,
  },
  {
    name: 'Ilona et Logan (@renovation.ilona.logan)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/renovation.ilona.logan',
    email: 'contact.ilonalogan@gmail.com',
    followers: 103000,
    location: 'Grenoble, France',
    topicsNotes: 'Couple rénov, maison ancienne, authenticité',
    audienceNotes: '78% femmes 25-50 ans',
    fitThemeScore: 94,
    fitGeoScore: 83,
    fitTimingScore: 87,
  },
  {
    name: 'Sébastien (@lesrenovationsdeseb)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/lesrenovationsdeseb',
    email: 'lesrenovationsdeseb@lumera.social',
    followers: 127000,
    location: 'Bordeaux, France',
    topicsNotes: 'Rénovation DIY, tutoriels pratiques',
    audienceNotes: '62% femmes 28-55 ans',
    fitThemeScore: 91,
    fitGeoScore: 90,
    fitTimingScore: 89,
  },
  {
    name: 'Micka (@passionrenovation)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/passionrenovation',
    email: 'varlet.eric@gmail.com',
    followers: 88000,
    location: 'Nantes, France',
    topicsNotes: 'Passion rénovation, outils, techniques',
    audienceNotes: '55% hommes 30-60 ans',
    fitThemeScore: 84,
    fitGeoScore: 85,
    fitTimingScore: 78,
  },
  {
    name: 'Anaïs (@anaiss_renovation)',
    mainPlatform: 'INSTAGRAM',
    profileUrl: 'https://www.instagram.com/anaiss_renovation',
    email: 'anaissrenovation@gmail.com',
    followers: 73000,
    location: 'Lille, France',
    topicsNotes: 'Rénovation féminine, couleurs, ambiances',
    audienceNotes: '92% femmes 25-48 ans',
    fitThemeScore: 90,
    fitGeoScore: 88,
    fitTimingScore: 82,
  },
];

// Statuts possibles du pipeline
const PROJECT_STATUSES = [
  'PROSPECTION',
  'PREMIER_CONTACT',
  'NEGOCIATION',
  'PROPOSITION',
  'ACCORD',
  'EN_COURS',
  'TERMINE',
  'REFUSE',
  'A_RECONTACTER',
];

async function main() {
  console.log('🌱 Début du seeding CRM...\n');

  // 1. Créer les influenceurs avec leurs stats
  console.log('📊 Création des influenceurs avec stats et scores...');
  
  const createdInfluencers = [];
  
  for (const influencerData of influencersData) {
    const influencer = await prisma.influencer.create({
      data: {
        ...influencerData,
        // Ajouter des stats snapshot aléatoires
        statsSnapshots: {
          create: [
            {
              platform: influencerData.mainPlatform,
              period: 'LAST_30_DAYS',
              avgViews: Math.floor(Math.random() * 50000) + 10000,
              avgLikes: Math.floor(Math.random() * 5000) + 500,
              avgComments: Math.floor(Math.random() * 500) + 50,
            },
          ],
        },
        // Créer un score initial
        scores: {
          create: {
            totalScore: (influencerData.fitThemeScore || 50) * 0.5 + Math.random() * 30,
            impactCollabsScore: Math.random() * 100,
            organicPotentialScore: Math.random() * 100,
            profitabilityScore: Math.random() * 100,
            strategicFitScore: (influencerData.fitThemeScore || 50) * 1.0,
            weightImpactCollabs: 0.4,
            weightOrganicPotential: 0.25,
            weightProfitability: 0.15,
            weightStrategicFit: 0.2,
          },
        },
      },
    });
    
    createdInfluencers.push(influencer);
    console.log(`  ✅ ${influencer.name}`);
  }

  console.log(`\n✅ ${createdInfluencers.length} influenceurs créés\n`);

  // 2. Créer des projets dans différents statuts
  console.log('📋 Création des projets (pipeline)...');

  const projectsData = [
    // TERMINE (avec stats de collaboration)
    {
      name: 'Collab Rentrée 2025 - Siham',
      influencerId: createdInfluencers[0].id,
      status: 'TERMINE',
      description: 'Vidéo Reels sur le relooking du salon avec produits Décor Discount',
      plannedStartDate: new Date('2025-09-05'),
      plannedEndDate: new Date('2025-09-15'),
      actualStartDate: new Date('2025-09-05'),
      actualEndDate: new Date('2025-09-14'),
      budgetAlloue: 1200,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 80000,
      predictedLikes: 8000,
      predictedComments: 600,
      predictedCPV: 0.015,
      priority: 'HIGH',
      tags: 'rentree,salon,decoration',
    },
    {
      name: 'Collab Halloween - Laura',
      influencerId: createdInfluencers[1].id,
      status: 'TERMINE',
      description: 'Story + Reel décoration Halloween',
      plannedStartDate: new Date('2025-10-20'),
      plannedEndDate: new Date('2025-10-31'),
      actualStartDate: new Date('2025-10-20'),
      actualEndDate: new Date('2025-10-30'),
      budgetAlloue: 800,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 45000,
      predictedLikes: 4500,
      predictedComments: 350,
      predictedCPV: 0.018,
      priority: 'MEDIUM',
      tags: 'halloween,decoration,saison',
    },
    
    // EN_COURS
    {
      name: 'Collab Noël 2025 - Pierre & Phil',
      influencerId: createdInfluencers[12].id,
      status: 'EN_COURS',
      description: 'Série de 3 Reels sur la décoration de Noël avec notre gamme premium',
      plannedStartDate: new Date('2025-12-01'),
      plannedEndDate: new Date('2025-12-25'),
      actualStartDate: new Date('2025-12-01'),
      budgetAlloue: 2500,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 150000,
      predictedLikes: 15000,
      predictedComments: 1200,
      predictedCPV: 0.017,
      priority: 'HIGH',
      tags: 'noel,premium,decoration',
      lastContactDate: new Date('2025-11-25'),
      nextActionDate: new Date('2025-12-15'),
    },
    {
      name: 'Collab Hiver - Emma DIY',
      influencerId: createdInfluencers[2].id,
      status: 'EN_COURS',
      description: 'Tutoriel DIY couture avec tissus Décor Discount',
      plannedStartDate: new Date('2025-11-28'),
      plannedEndDate: new Date('2025-12-10'),
      actualStartDate: new Date('2025-11-28'),
      budgetAlloue: 600,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 35000,
      predictedLikes: 3500,
      predictedComments: 280,
      predictedCPV: 0.017,
      priority: 'MEDIUM',
      tags: 'diy,hiver,tutoriel',
      lastContactDate: new Date('2025-11-26'),
    },

    // ACCORD
    {
      name: 'Collab Printemps 2026 - Sabrina',
      influencerId: createdInfluencers[3].id,
      status: 'ACCORD',
      description: 'Rénovation complète cuisine avec before/after',
      plannedStartDate: new Date('2026-03-01'),
      plannedEndDate: new Date('2026-03-31'),
      budgetAlloue: 1800,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 95000,
      predictedLikes: 9500,
      predictedComments: 750,
      predictedCPV: 0.019,
      priority: 'HIGH',
      tags: 'printemps,cuisine,renovation',
      lastContactDate: new Date('2025-11-20'),
      nextActionDate: new Date('2026-02-15'),
    },
    {
      name: 'Partenariat Annuel - Élie & Alex',
      influencerId: createdInfluencers[10].id,
      status: 'ACCORD',
      description: 'Contrat 12 mois - 1 Reel par mois sur projets rénovation',
      plannedStartDate: new Date('2026-01-01'),
      plannedEndDate: new Date('2026-12-31'),
      budgetAlloue: 15000,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 120000,
      predictedLikes: 12000,
      predictedComments: 950,
      predictedCPV: 0.0104,
      priority: 'HIGH',
      tags: 'annuel,renovation,partenariat',
      lastContactDate: new Date('2025-11-22'),
      nextActionDate: new Date('2025-12-20'),
    },

    // PROPOSITION
    {
      name: 'Collab Saint-Valentin - Charlotte',
      influencerId: createdInfluencers[11].id,
      status: 'PROPOSITION',
      description: 'Offre envoyée: 950€ pour 1 Reel + 3 Stories décoration romantique',
      plannedStartDate: new Date('2026-02-01'),
      plannedEndDate: new Date('2026-02-14'),
      budgetAlloue: 950,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 42000,
      predictedLikes: 4200,
      predictedComments: 320,
      predictedCPV: 0.023,
      priority: 'MEDIUM',
      tags: 'saint-valentin,romantique,decoration',
      lastContactDate: new Date('2025-11-24'),
      nextActionDate: new Date('2025-12-02'),
      reminderSet: true,
    },
    {
      name: 'Collab Pâques 2026 - Raphaël',
      influencerId: createdInfluencers[14].id,
      status: 'PROPOSITION',
      description: 'Offre envoyée: 1400€ pour 2 Reels décoration printanière',
      plannedStartDate: new Date('2026-03-20'),
      plannedEndDate: new Date('2026-04-10'),
      budgetAlloue: 1400,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 75000,
      predictedLikes: 7500,
      predictedComments: 580,
      predictedCPV: 0.019,
      priority: 'MEDIUM',
      tags: 'paques,printemps,decoration',
      lastContactDate: new Date('2025-11-23'),
      nextActionDate: new Date('2025-12-01'),
      reminderSet: true,
    },

    // NEGOCIATION
    {
      name: 'Collab Été 2026 - Ilona et Logan',
      influencerId: createdInfluencers[18].id,
      status: 'NEGOCIATION',
      description: 'En discussion sur le budget et format (veulent faire 3 Reels au lieu de 2)',
      plannedStartDate: new Date('2026-06-01'),
      plannedEndDate: new Date('2026-07-15'),
      budgetAlloue: 2200,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 110000,
      predictedLikes: 11000,
      predictedComments: 850,
      predictedCPV: 0.020,
      priority: 'HIGH',
      tags: 'ete,exterieur,jardin',
      lastContactDate: new Date('2025-11-26'),
      nextActionDate: new Date('2025-12-03'),
      reminderSet: true,
    },
    {
      name: 'Collab Rentrée 2026 - Sébastien',
      influencerId: createdInfluencers[19].id,
      status: 'NEGOCIATION',
      description: 'Négocie format tutoriel DIY vs Reel classique',
      plannedStartDate: new Date('2026-09-01'),
      plannedEndDate: new Date('2026-09-20'),
      budgetAlloue: 1600,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 88000,
      predictedLikes: 8800,
      predictedComments: 680,
      predictedCPV: 0.018,
      priority: 'MEDIUM',
      tags: 'rentree,diy,tutoriel',
      lastContactDate: new Date('2025-11-27'),
      nextActionDate: new Date('2025-12-05'),
    },

    // PREMIER_CONTACT
    {
      name: 'Prospection Hiver 2026 - Anaïs Papadopoulos',
      influencerId: createdInfluencers[5].id,
      status: 'PREMIER_CONTACT',
      description: 'Premier message envoyé le 25/11/2025',
      plannedStartDate: new Date('2026-01-15'),
      plannedEndDate: new Date('2026-02-15'),
      budgetAlloue: 1100,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 52000,
      predictedLikes: 5200,
      predictedComments: 400,
      predictedCPV: 0.021,
      priority: 'MEDIUM',
      tags: 'hiver,renovation,home-staging',
      lastContactDate: new Date('2025-11-25'),
      nextActionDate: new Date('2025-12-02'),
      reminderSet: true,
    },
    {
      name: 'Prospection Printemps - Casadesecureuils',
      influencerId: createdInfluencers[8].id,
      status: 'PREMIER_CONTACT',
      description: 'Premier DM envoyé, en attente réponse',
      plannedStartDate: new Date('2026-03-01'),
      plannedEndDate: new Date('2026-03-31'),
      budgetAlloue: 1300,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 68000,
      predictedLikes: 6800,
      predictedComments: 520,
      predictedCPV: 0.019,
      priority: 'MEDIUM',
      tags: 'printemps,maison-cosy,decoration',
      lastContactDate: new Date('2025-11-26'),
      nextActionDate: new Date('2025-12-03'),
    },

    // PROSPECTION
    {
      name: 'Prospect Automne 2026 - Micka',
      influencerId: createdInfluencers[20].id,
      status: 'PROSPECTION',
      description: 'Identifié pour campagne automne, pas encore contacté',
      plannedStartDate: new Date('2026-09-15'),
      plannedEndDate: new Date('2026-10-31'),
      budgetAlloue: 1400,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 72000,
      predictedLikes: 7200,
      predictedComments: 550,
      predictedCPV: 0.019,
      priority: 'LOW',
      tags: 'automne,outils,renovation',
      nextActionDate: new Date('2026-08-01'),
    },
    {
      name: 'Prospect Noël 2026 - Anaïs Rénov',
      influencerId: createdInfluencers[21].id,
      status: 'PROSPECTION',
      description: 'À contacter pour campagne Noël 2026',
      plannedStartDate: new Date('2026-12-01'),
      plannedEndDate: new Date('2026-12-24'),
      budgetAlloue: 1200,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 58000,
      predictedLikes: 5800,
      predictedComments: 450,
      predictedCPV: 0.021,
      priority: 'LOW',
      tags: 'noel,decoration,feminite',
      nextActionDate: new Date('2026-10-01'),
    },

    // REFUSE
    {
      name: 'Tentative Collab - Olivier Petibon',
      influencerId: createdInfluencers[4].id,
      status: 'REFUSE',
      description: 'Refusé - ne correspond pas à la ligne éditoriale',
      budgetAlloue: 2000,
      platform: 'YOUTUBE',
      formatType: 'YOUTUBE_INTEGRATION',
      priority: 'LOW',
      tags: 'refuse,business',
      lastContactDate: new Date('2025-10-15'),
      notes: 'Trop business/corporate, pas la bonne audience',
    },
    {
      name: 'Tentative Collab - Fabien Sanz',
      influencerId: createdInfluencers[6].id,
      status: 'REFUSE',
      description: 'Refusé - budget trop élevé',
      budgetAlloue: 3500,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      priority: 'LOW',
      tags: 'refuse,budget',
      lastContactDate: new Date('2025-09-20'),
      notes: 'Demandait 3500€ pour 1 Reel, trop cher',
    },

    // A_RECONTACTER
    {
      name: 'Recontact Futur - Lequatrefeuilles',
      influencerId: createdInfluencers[7].id,
      status: 'A_RECONTACTER',
      description: 'Intéressé mais pas dispo avant avril 2026',
      plannedStartDate: new Date('2026-04-15'),
      plannedEndDate: new Date('2026-05-15'),
      budgetAlloue: 1500,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 82000,
      predictedLikes: 8200,
      predictedComments: 630,
      predictedCPV: 0.018,
      priority: 'MEDIUM',
      tags: 'famille,lifestyle,produits',
      lastContactDate: new Date('2025-11-15'),
      nextActionDate: new Date('2026-03-15'),
      notes: 'Recontacter mi-mars pour confirmer disponibilité avril',
    },
    {
      name: 'Recontact Futur - Mathieu Richard',
      influencerId: createdInfluencers[16].id,
      status: 'A_RECONTACTER',
      description: 'Intéressé mais veut voir nos nouveaux produits avant',
      plannedStartDate: new Date('2026-05-01'),
      plannedEndDate: new Date('2026-06-01'),
      budgetAlloue: 2400,
      platform: 'INSTAGRAM',
      formatType: 'REEL',
      predictedViews: 135000,
      predictedLikes: 13500,
      predictedComments: 1050,
      predictedCPV: 0.018,
      priority: 'LOW',
      tags: 'tech,innovation,premium',
      lastContactDate: new Date('2025-11-10'),
      nextActionDate: new Date('2026-04-01'),
      notes: 'Attend sortie nouvelle collection printemps',
    },
  ];

  const createdProjects = [];
  for (const projectData of projectsData) {
    const project = await prisma.project.create({
      data: projectData,
    });
    createdProjects.push(project);
    console.log(`  ✅ ${project.name} [${project.status}]`);
  }

  console.log(`\n✅ ${createdProjects.length} projets créés\n`);

  // 3. Ajouter les CollaborationStats pour les projets TERMINE
  console.log('📈 Ajout des stats de collaboration pour projets terminés...');

  const terminatedProjects = createdProjects.filter((p) => p.status === 'TERMINE');

  for (const project of terminatedProjects) {
    // Simuler des résultats réalistes (légère variance vs prédictions)
    const viewsVariance = (Math.random() - 0.5) * 0.4; // ±20%
    const likesVariance = (Math.random() - 0.5) * 0.5; // ±25%
    const commentsVariance = (Math.random() - 0.5) * 0.6; // ±30%

    const actualViews = Math.floor(project.predictedViews! * (1 + viewsVariance));
    const actualLikes = Math.floor(project.predictedLikes! * (1 + likesVariance));
    const actualComments = Math.floor(project.predictedComments! * (1 + commentsVariance));
    const actualPrice = project.budgetAlloue!;
    const actualCPV = actualViews > 0 ? actualPrice / actualViews : 0;

    // Calculer variances en %
    const viewsVariancePct = ((actualViews - project.predictedViews!) / project.predictedViews!) * 100;
    const likesVariancePct = ((actualLikes - project.predictedLikes!) / project.predictedLikes!) * 100;
    const commentsVariancePct =
      ((actualComments - project.predictedComments!) / project.predictedComments!) * 100;
    const cpvVariancePct = ((actualCPV - project.predictedCPV!) / project.predictedCPV!) * 100;

    // Déterminer performance rating
    let performanceRating = 'MOYEN';
    let recommendRecollab = true;

    if (viewsVariancePct > 20 && cpvVariancePct < -10) {
      performanceRating = 'EXCELLENT';
      recommendRecollab = true;
    } else if (viewsVariancePct > 5 && cpvVariancePct < 5) {
      performanceRating = 'BON';
      recommendRecollab = true;
    } else if (viewsVariancePct < -15 || cpvVariancePct > 20) {
      performanceRating = 'DECEVANT';
      recommendRecollab = false;
    } else {
      recommendRecollab = viewsVariancePct > -10;
    }

    await prisma.projectCollaborationStats.create({
      data: {
        projectId: project.id,
        title: project.name,
        platform: project.platform!,
        formatType: project.formatType!,
        publishDate: project.actualEndDate,
        actualViews,
        actualLikes,
        actualComments,
        actualPrice,
        actualCPV,
        viewsVariance: viewsVariancePct,
        likesVariance: likesVariancePct,
        commentsVariance: commentsVariancePct,
        cpvVariance: cpvVariancePct,
        performanceRating,
        recommendRecollab,
      },
    });

    console.log(`  ✅ Stats pour "${project.name}" - ${performanceRating}`);
  }

  console.log(`\n✅ ${terminatedProjects.length} collaborations avec stats complètes\n`);

  // 4. Statistiques finales
  console.log('📊 STATISTIQUES FINALES:\n');

  const statsPromises = PROJECT_STATUSES.map(async (status) => {
    const count = await prisma.project.count({ where: { status } });
    return { status, count };
  });

  const stats = await Promise.all(statsPromises);

  stats.forEach(({ status, count }) => {
    const emoji =
      status === 'TERMINE'
        ? '✅'
        : status === 'EN_COURS'
        ? '🔄'
        : status === 'ACCORD'
        ? '🤝'
        : status === 'PROPOSITION'
        ? '📤'
        : status === 'NEGOCIATION'
        ? '💬'
        : status === 'PREMIER_CONTACT'
        ? '👋'
        : status === 'PROSPECTION'
        ? '🔍'
        : status === 'REFUSE'
        ? '❌'
        : '⏰';
    console.log(`  ${emoji} ${status}: ${count} projets`);
  });

  // ============================================
  // 4. AJOUTER DES STATS HISTORIQUES (Pour Scoring)
  // ============================================
  console.log('\n📊 Ajout de stats historiques pour le scoring...');

  const topInfluencers = await prisma.influencer.findMany({
    where: {
      name: {
        in: ['Siham Azouggagh', 'Laura (@laura_gmua)', 'Sabrina (@casa_babouchka)', 'Emma (@Freundicouture)']
      }
    }
  });

  for (const influencer of topInfluencers) {
    // Ajouter 2-3 collaborations historiques par influenceur
    await prisma.collaborationStats.createMany({
      data: [
        {
          influencerId: influencer.id,
          title: 'Collab marque déco - Post',
          date: new Date('2024-10-15'),
          platform: 'INSTAGRAM',
          formatType: 'POST',
          views: 45000,
          likes: 4200,
          comments: 180,
          price: 800,
          isCollab: true,
        },
        {
          influencerId: influencer.id,
          title: 'Partenariat lifestyle - Reel',
          date: new Date('2024-11-02'),
          platform: 'INSTAGRAM',
          formatType: 'REEL',
          views: 78000,
          likes: 7800,
          comments: 320,
          price: 1200,
          isCollab: true,
        },
      ]
    });
  }

  console.log(`✅ ${topInfluencers.length * 2} stats historiques ajoutées`);

  const totalInfluencers = await prisma.influencer.count();
  const totalProjects = await prisma.project.count();
  const totalProjectCollabStats = await prisma.projectCollaborationStats.count();
  const totalHistoricalCollabStats = await prisma.collaborationStats.count();
  const totalScores = await prisma.score.count();

  console.log('\n🎉 SEEDING TERMINÉ!\n');
  console.log(`   👥 ${totalInfluencers} influenceurs`);
  console.log(`   📋 ${totalProjects} projets`);
  console.log(`   📈 ${totalProjectCollabStats} résultats de projets`);
  console.log(`   📊 ${totalHistoricalCollabStats} stats historiques pour scoring`);
  console.log(`   ⭐ ${totalScores} scores calculés\n`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
