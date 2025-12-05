# 🎯 Scoring Influenceurs - Application Complète

## ✅ Statut : **Application fonctionnelle et prête**

L'application est **démarrée et accessible sur http://localhost:3000** 🚀

---

## 📋 Résumé du projet

Application Next.js de notation d'influenceurs sur 100 points avec :
- ✅ Gestion complète des données partielles (pas de crash si données manquantes)
- ✅ Calcul automatique avec pondérations dynamiques
- ✅ Interface simple et propre avec Tailwind CSS
- ✅ Base de données SQLite pour le développement
- ✅ Compatible Postgres pour production (Vercel)

---

## 🎮 Comment utiliser l'application

### 1️⃣ Accéder à l'application
**L'application est déjà démarrée !**
- Ouvrez votre navigateur sur : **http://localhost:3000**
- Vous serez automatiquement redirigé vers la liste des influenceurs

### 2️⃣ Créer un influenceur
1. Cliquez sur **"+ Nouvel influenceur"** (bouton bleu en haut à droite)
2. Remplissez le formulaire :
   - **Nom** (obligatoire)
   - **Plateforme principale** (obligatoire)
   - URL du profil (optionnel)
   - Nombre d'abonnés (optionnel)
   - Localisation (optionnel)
   - Notes (optionnel)
3. Cliquez sur **"Créer l'influenceur"**

### 3️⃣ Renseigner les données
Sur la page de détail de l'influenceur, remplissez les sections :

**📊 Fit & Cible**
- Sujets/thématiques (texte libre)
- Audience/géographie (texte libre)
- Temporalité/projets (texte libre)
- Scores de fit (0-100) : thématique, géographique, temporel

**📈 Stats organiques**
- Cliquez sur "+ Ajouter" pour créer un snapshot
- Choisissez plateforme et période (15j, 30j, 3 mois)
- Renseignez vues, likes, commentaires (tous optionnels)

**🤝 Collaborations**
- Cliquez sur "+ Ajouter" pour créer une collab
- Renseignez titre, date, format
- Ajoutez les métriques : vues, likes, commentaires
- Indiquez le prix payé (optionnel)

### 4️⃣ Calculer le score
1. Une fois les données ajoutées, cliquez sur **"🔄 Recalculer le score"**
2. Le score total s'affiche avec les 4 composantes :
   - **Impact collabs** (vues/likes/commentaires des collabs)
   - **Potentiel organique** (stats organiques récentes)
   - **Rentabilité** (coût par vue)
   - **Fit stratégique** (alignement avec vos besoins)
3. Les pondérations s'ajustent automatiquement en fonction des données disponibles

---

## 🧮 Logique de scoring détaillée

### Pondérations de base
- **Impact collabs** : 40% (performances des collaborations)
- **Potentiel organique** : 25% (stats organiques)
- **Rentabilité** : 15% (rapport prix/performance)
- **Fit stratégique** : 20% (alignement cible/thème/timing)

### Gestion intelligente des données partielles
**L'app ne plante JAMAIS** car :
- Si un bloc n'a pas de données, il est ignoré
- Les pondérations sont automatiquement redistribuées
- Le calcul se fait toujours avec ce qui est disponible

**Exemples** :
- Pas de prix renseigné → rentabilité = 0%, les 15% sont redistribués
- Seulement 3 collabs au lieu de 6 → calcul sur les 3
- Pas de stats 3 mois → calcul uniquement sur 15j et 30j
- Aucun score de fit → fit stratégique ignoré, pondération reportée

### Normalisation des métriques

**Vues** (0-100)
- 100k vues = 100/100
- Échelle linéaire, plafonnée à 100

**Likes** (0-100)
- 5k likes = 100/100
- Échelle linéaire, plafonnée à 100

**Commentaires** (0-100)
- 500 commentaires = 100/100
- Échelle linéaire, plafonnée à 100

**CPV - Coût Par Vue** (0-100)
- 0.0001 €/vue = excellent (100/100)
- 0.01 €/vue = très mauvais (0/100)
- Échelle inverse : moins cher = meilleur score

---

## 📁 Architecture technique

```
INFLUENCEURS/
├── app/                          # Pages Next.js (App Router)
│   ├── influencers/
│   │   ├── page.tsx              # Liste avec tri et filtres
│   │   ├── new/page.tsx          # Formulaire de création
│   │   └── [id]/page.tsx         # Fiche détaillée (tous les blocs)
│   ├── layout.tsx                # Layout principal avec nav
│   ├── page.tsx                  # Redirect vers /influencers
│   └── globals.css               # Styles Tailwind
│
├── lib/
│   ├── actions/                  # Server Actions
│   │   ├── influencers.ts        # CRUD influenceurs + fit
│   │   ├── stats.ts              # CRUD stats organiques
│   │   ├── collabs.ts            # CRUD collaborations
│   │   └── scores.ts             # Calcul et sauvegarde score
│   ├── scoring/
│   │   └── computeInfluencerScore.ts  # Logique de calcul complète
│   ├── prisma.ts                 # Client Prisma singleton
│   └── types.ts                  # Enums TypeScript (Platform, etc.)
│
├── prisma/
│   ├── schema.prisma             # Modèles DB (4 tables)
│   └── dev.db                    # Base SQLite (générée)
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env                          # DATABASE_URL
```

### Stack technique
- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **ORM** : Prisma
- **DB dev** : SQLite
- **DB prod** : Postgres (compatible)
- **Style** : Tailwind CSS
- **Server Actions** : Formulaires natifs Next.js

---

## 🗄️ Modèle de données

### 4 tables principales

**Influencer**
- Infos de base (nom, plateforme, followers, etc.)
- Fit/cible (textes + scores 0-100)

**StatsSnapshot**
- Stats organiques par période
- Plateforme + période (15j/30j/3m) + métriques

**CollaborationStats**
- Stats des collaborations
- Format, date, métriques, prix

**Score**
- Scores calculés
- Score total + 4 sous-scores + pondérations

---

## 🚀 Déploiement sur Vercel

### Prérequis
1. Compte Vercel
2. Compte GitHub
3. Base Postgres Vercel (gratuite)

### Étapes

**1. Préparer Git**
```bash
cd C:\Users\Utilisateur\Documents\DEV\INFLUENCEURS
git init
git add .
git commit -m "Initial commit - Scoring Influenceurs"
```

**2. Créer un repo GitHub**
- Créer un nouveau repository sur GitHub
- Pousser le code :
```bash
git remote add origin https://github.com/votre-username/influenceurs-scoring.git
git branch -M main
git push -u origin main
```

**3. Importer sur Vercel**
- Aller sur vercel.com
- "Add New" → "Project"
- Importer depuis GitHub
- Sélectionner le repository

**4. Configurer la base de données**
- Dans Vercel : Storage → Create Database → Postgres
- Copier la variable `DATABASE_URL`
- Dans les settings du projet : Environment Variables
- Ajouter `DATABASE_URL` avec la valeur Postgres

**5. Modifier le schéma Prisma pour Postgres**
Dans `prisma/schema.prisma`, changer :
```prisma
datasource db {
  provider = "postgresql"  // au lieu de "sqlite"
  url      = env("DATABASE_URL")
}
```

**6. Commit et redéployer**
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

Vercel redéploiera automatiquement ! 🎉

---

## 🔧 Commandes utiles

```bash
# Développement
npm run dev              # Démarrer le serveur (port 3000)

# Base de données
npm run db:generate      # Générer le client Prisma
npm run db:push          # Synchroniser le schéma avec la DB
npm run db:studio        # Ouvrir Prisma Studio (interface graphique)

# Build
npm run build            # Build pour production
npm run start            # Démarrer en production
npm run lint             # Linter le code
```

---

## 🎨 Personnalisation

### Changer les références de normalisation
Dans `lib/scoring/computeInfluencerScore.ts`, modifier :
```typescript
const maxRef = 100_000;  // 100k vues = 100/100
const maxRef = 5_000;    // 5k likes = 100/100
const maxRef = 500;      // 500 coms = 100/100
```

### Ajuster les pondérations de base
Dans `lib/scoring/computeInfluencerScore.ts` :
```typescript
const baseImpact = 40;   // Impact collabs
const baseOrganic = 25;  // Potentiel organique
const baseProfit = 15;   // Rentabilité
const baseFit = 20;      // Fit stratégique
```

### Modifier les couleurs
Dans `tailwind.config.js` ou directement dans les classes CSS

---

## 🐛 Dépannage

**Le serveur ne démarre pas**
```bash
# Vérifier le port
npm run dev -- -p 3001  # Utiliser le port 3001

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

**Erreur Prisma**
```bash
# Régénérer le client
npm run db:generate
npm run db:push
```

**Base corrompue**
```bash
# Supprimer et recréer
rm prisma/dev.db
npm run db:push
```

**Erreurs TypeScript**
```bash
# Vérifier les types
npx tsc --noEmit
```

---

## 📊 Visualiser la base de données

Pour voir les données en temps réel :
```bash
npm run db:studio
```
Prisma Studio s'ouvrira dans votre navigateur !

---

## ✨ Fonctionnalités clés

✅ **Aucun plantage** : Gère toutes les données manquantes
✅ **Pondérations dynamiques** : S'ajustent automatiquement
✅ **Calcul précis** : 4 dimensions avec normalisation
✅ **Interface intuitive** : Formulaires simples et clairs
✅ **Historique des scores** : Tous les calculs sont sauvegardés
✅ **Filtres et tri** : Par score, abonnés, plateforme
✅ **Production ready** : Compatible Vercel et Postgres

---

## 📝 Notes importantes

1. **SQLite en dev, Postgres en prod** : Le schéma est compatible
2. **Pas d'authentification** : Application interne simple
3. **Données partielles OK** : L'app calcule avec ce qu'elle a
4. **Scores historisés** : Chaque calcul crée un nouvel enregistrement
5. **Types stricts** : TypeScript pour éviter les erreurs

---

## 🎯 Prochaines étapes suggérées

- [ ] Tester avec des données réelles
- [ ] Ajuster les références de normalisation si besoin
- [ ] Déployer sur Vercel
- [ ] Ajouter plus d'influenceurs
- [ ] Comparer les scores entre influenceurs

---

**Application créée le 28 novembre 2025**
**Prête à l'emploi ! 🚀**
