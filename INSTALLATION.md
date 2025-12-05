# Guide d'installation et de démarrage

## 📦 Installation

1. **Installer les dépendances**
   ```bash
   cd C:\Users\Utilisateur\Documents\DEV\INFLUENCEURS
   npm install
   ```

2. **Configurer Prisma et créer la base de données SQLite**
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   - Aller sur http://localhost:3000
   - Vous serez redirigé vers `/influencers`

## 🎯 Utilisation

### Créer un influenceur
1. Cliquer sur "+ Nouvel influenceur" dans la navigation
2. Remplir le formulaire (nom et plateforme obligatoires)
3. Soumettre → redirection vers la fiche de détail

### Ajouter des données
Sur la page de détail d'un influenceur :

1. **Fit & Cible** : Renseigner les informations qualitatives et les scores de fit (0-100)
2. **Stats organiques** : Ajouter des snapshots de stats (15j, 30j, 3 mois)
3. **Collaborations** : Ajouter des collaborations avec leurs métriques et prix

### Calculer le score
1. Cliquer sur "🔄 Recalculer le score"
2. Le score est calculé automatiquement en fonction des données disponibles
3. Les pondérations s'ajustent automatiquement si certaines données manquent

## 🗄️ Base de données

### Développement local
- SQLite : fichier `prisma/dev.db`
- Visualiser la DB : `npm run db:studio`

### Production (Vercel)
Pour déployer sur Vercel avec Postgres :

1. Créer une base Postgres sur Vercel
2. Dans les paramètres Vercel, ajouter la variable d'environnement :
   ```
   DATABASE_URL="postgres://..."
   ```
3. Modifier `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider = "postgresql"  // au lieu de "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
4. Commit et push sur Git
5. Vercel déploiera automatiquement

## 🔄 Logique de scoring

Le score total est calculé sur 100 points avec 4 composantes :

1. **Impact collabs (40% base)** : Performance des collaborations récentes
2. **Potentiel organique (25% base)** : Stats organiques sur différentes périodes
3. **Rentabilité (15% base)** : Coût par vue (CPV)
4. **Fit stratégique (20% base)** : Alignement thématique, géographique, temporel

**Gestion des données partielles** :
- Si une composante n'a pas de données, sa pondération est redistribuée aux autres
- L'app ne plante jamais, elle calcule avec ce qui est disponible
- Exemple : sans données de prix, la rentabilité est ignorée et les poids recalculés

## 📁 Structure du projet

```
INFLUENCEURS/
├── app/
│   ├── influencers/
│   │   ├── page.tsx              # Liste des influenceurs
│   │   ├── new/
│   │   │   └── page.tsx          # Création d'influenceur
│   │   └── [id]/
│   │       └── page.tsx          # Détail d'influenceur
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── actions/
│   │   ├── influencers.ts        # Actions CRUD influenceurs
│   │   ├── stats.ts              # Actions stats organiques
│   │   ├── collabs.ts            # Actions collaborations
│   │   └── scores.ts             # Action calcul de score
│   ├── scoring/
│   │   └── computeInfluencerScore.ts  # Logique de scoring
│   └── prisma.ts
├── prisma/
│   └── schema.prisma             # Schéma de base de données
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env
```

## 🚀 Déploiement

### Git
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <votre-repo>
git push -u origin main
```

### Vercel
1. Importer le projet depuis Git
2. Configurer les variables d'environnement (DATABASE_URL)
3. Déployer

## 🐛 Troubleshooting

**Erreur Prisma** : Relancer `npm run db:generate` puis `npm run db:push`

**Port déjà utilisé** : Modifier le port avec `npm run dev -- -p 3001`

**Base de données corrompue** : Supprimer `prisma/dev.db` et relancer `npm run db:push`
