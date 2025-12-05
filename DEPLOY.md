# 🚀 Guide de Déploiement - CRM Influenceurs sur Vercel

## Domaine: www.d2d.ink-creative.fr

Ce guide vous accompagne pour déployer l'application CRM Influenceurs sur Vercel avec PostgreSQL.

---

## 📋 Prérequis

- Compte Vercel (https://vercel.com)
- Compte GitHub (le projet doit être sur GitHub)
- Node.js 18+ installé localement

---

## 🗄️ Étape 1: Créer la base de données PostgreSQL

### Option A: Vercel Postgres (Recommandé)

1. Allez sur votre projet Vercel
2. Onglet **Storage** → **Create Database**
3. Sélectionnez **Postgres**
4. Nommez-la: `influenceurs-db`
5. Cliquez sur **Create**
6. Vercel va automatiquement créer les variables d'environnement

### Option B: Supabase (Alternative gratuite)

1. Allez sur https://supabase.com
2. Créez un nouveau projet: `influenceurs-crm`
3. Région: Europe (Frankfurt) pour de meilleures performances
4. Récupérez la **Connection String** dans Settings → Database
5. Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

---

## 🔧 Étape 2: Configuration Vercel

### 2.1 Connecter votre repository GitHub

1. Allez sur https://vercel.com/new
2. Importez votre repository GitHub
3. Configurez le projet:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next`

### 2.2 Variables d'environnement

Dans **Settings** → **Environment Variables**, ajoutez:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Important:** Si vous utilisez Vercel Postgres, cette variable est déjà créée automatiquement.

### 2.3 Configuration du domaine personnalisé

1. Allez dans **Settings** → **Domains**
2. Ajoutez: `d2d.ink-creative.fr`
3. Configurez vos DNS chez votre registrar:
   - Type: `CNAME`
   - Name: `d2d` (ou `www.d2d`)
   - Value: `cname.vercel-dns.com`
   - TTL: `3600`

---

## 📊 Étape 3: Migrer les données (si vous avez des données existantes)

### 3.1 Exporter les données SQLite locales

```bash
# Dans votre projet local
npx tsx scripts/export-sqlite-data.ts
```

Cela crée un fichier `prisma/export-sqlite-data.json`

### 3.2 Initialiser la base PostgreSQL

```bash
# Mettez à jour .env avec votre DATABASE_URL PostgreSQL
# Puis exécutez:
npx prisma migrate dev --name init
```

### 3.3 Importer les données

Créez un script `scripts/import-data.ts` ou utilisez Prisma Studio:

```bash
npx prisma studio
```

Importez manuellement les données depuis le JSON exporté.

---

## 🚀 Étape 4: Déploiement

### 4.1 Push sur GitHub

```bash
git add .
git commit -m "Préparation pour déploiement Vercel avec PostgreSQL"
git push origin main
```

### 4.2 Vercel va automatiquement:

1. ✅ Détecter le push
2. ✅ Installer les dépendances
3. ✅ Exécuter `prisma generate`
4. ✅ Build Next.js
5. ✅ Déployer

### 4.3 Exécuter les migrations en production

Une fois déployé, ouvrez un terminal Vercel ou utilisez Vercel CLI:

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Exécuter la migration
vercel env pull .env.production
npx prisma migrate deploy
```

---

## ✅ Étape 5: Vérification

1. **Accédez à votre site**: https://d2d.ink-creative.fr
2. **Testez les pages**:
   - Dashboard: `/`
   - Influenceurs: `/influencers`
   - Pipeline: `/projects/pipeline`
   - Calendrier: `/calendar`

3. **Vérifiez la base de données**:
   ```bash
   npx prisma studio
   ```

---

## 🔒 Étape 6: Sécurité (Post-déploiement)

### 6.1 Ajouter l'authentification (optionnel mais recommandé)

Installez NextAuth.js pour protéger l'application:

```bash
npm install next-auth @auth/prisma-adapter
```

### 6.2 Variables d'environnement sensibles

Assurez-vous que `.env` est dans `.gitignore`:

```gitignore
.env
.env.local
.env.production
*.db
*.db-journal
```

---

## 📝 Commandes utiles

```bash
# Voir les logs en temps réel
vercel logs

# Redéployer
vercel --prod

# Variables d'environnement
vercel env ls
vercel env add DATABASE_URL

# Prisma
npx prisma studio          # Interface graphique
npx prisma migrate deploy  # Migrations production
npx prisma db push         # Push schema sans migration
```

---

## 🐛 Troubleshooting

### Erreur: "Can't reach database server"

- Vérifiez que `DATABASE_URL` est bien configurée dans Vercel
- Vérifiez que votre base PostgreSQL accepte les connexions externes
- Pour Supabase: vérifiez que SSL est activé (`?sslmode=require`)

### Erreur: "Module not found: Can't resolve '@prisma/client'"

```bash
vercel env pull
npx prisma generate
git add .
git commit -m "Regenerate Prisma Client"
git push
```

### Erreur de build: "Command failed: prisma generate"

- Vérifiez que `prisma` est dans `dependencies` (pas `devDependencies`)
- Ajoutez un script `postinstall` dans `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## 🎉 C'est fait !

Votre CRM Influenceurs est maintenant en ligne sur **www.d2d.ink-creative.fr** avec PostgreSQL ! 🚀

Pour toute question, consultez:
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Next.js](https://nextjs.org/docs)
