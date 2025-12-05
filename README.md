# Influenceurs Scoring - CRM Multi-Plateformes

Application de notation et gestion d'influenceurs avec support multi-plateformes.

## 🆕 Nouveau : Système Multi-Plateformes

Gérez les influenceurs présents sur **plusieurs réseaux sociaux** simultanément :
- 📸 **Instagram**
- 🎵 **TikTok**  
- ▶️ **YouTube**
- 🌐 **Autres plateformes**

Chaque influenceur peut avoir des comptes sur plusieurs plateformes, avec tracking séparé des abonnés, URLs et performances.

## ⚠️ Migration requise

**Si vous aviez une version précédente**, vous devez migrer la base de données :

```bash
# 1. Arrêter le serveur (Ctrl+C)

# 2. Migrer la DB
npx prisma db push

# 3. Régénérer le client Prisma
npx prisma generate

# 4. Redémarrer
npm run dev
```

**📖 Documentation détaillée** : Voir `MIGRATION_INSTRUCTIONS.md`

## Démarrage local (première installation)

```bash
# Installer les dépendances
npm install

# Générer le client Prisma et créer la DB
npm run db:generate
npm run db:push

# Démarrer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Base de données

- **Dev** : SQLite (fichier local `prisma/dev.db`)
- **Production** : Postgres (Vercel)

## Scripts disponibles

- `npm run dev` : Démarrer en mode développement
- `npm run build` : Build pour production
- `npm run start` : Démarrer en production
- `npm run db:push` : Synchroniser le schéma Prisma avec la DB
- `npm run db:studio` : Ouvrir Prisma Studio (interface graphique de la DB)
- `npm run db:generate` : Générer le client Prisma

## Déploiement Vercel

1. Créer une base Postgres sur Vercel
2. Remplacer `DATABASE_URL` dans les variables d'environnement Vercel
3. Push sur Git
4. Déployer automatiquement depuis Vercel
