# 🚀 Déploiement Rapide - CRM Influenceurs

## ✅ Configuration Terminée

Le projet est prêt pour le déploiement sur **Vercel** avec **PostgreSQL**.

---

## 🎯 Checklist Pré-Déploiement

- [x] Schema Prisma configuré pour PostgreSQL
- [x] Scripts de build mis à jour dans package.json
- [x] vercel.json créé
- [x] .env.example fourni
- [x] .gitignore mis à jour
- [x] Documentation complète (DEPLOY.md)
- [x] Script d'export des données SQLite

---

## 📦 Fichiers Modifiés pour la Production

| Fichier | Modification |
|---------|-------------|
| `prisma/schema.prisma` | Provider changé de `sqlite` → `postgresql` |
| `package.json` | Ajout de `postinstall` et `db:migrate` |
| `vercel.json` | Configuration build et headers sécurité |
| `.env.example` | Template pour PostgreSQL |
| `.gitignore` | Ajout des fichiers de production |

---

## ⚡ Déploiement en 5 Minutes

### 1️⃣ Créer la base PostgreSQL

**Option Vercel Postgres:**
```bash
# Sur Vercel Dashboard
Storage → Create Database → Postgres
```

**Option Supabase:**
```bash
# Sur supabase.com
New Project → Récupérer Connection String
```

### 2️⃣ Push sur GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 3️⃣ Déployer sur Vercel

```bash
# Via l'interface web
https://vercel.com/new

# Ou via CLI
npm i -g vercel
vercel
```

### 4️⃣ Configurer le domaine

**Dans Vercel Dashboard:**
- Settings → Domains → Add `d2d.ink-creative.fr`

**Chez votre registrar DNS:**
```
Type: CNAME
Name: d2d (ou www.d2d)
Value: cname.vercel-dns.com
```

### 5️⃣ Initialiser la base de données

```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Pull les variables d'environnement
vercel env pull .env.production

# Exécuter les migrations
npx prisma migrate deploy
```

---

## 🔗 URLs Importantes

- **Production:** https://d2d.ink-creative.fr
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentation complète:** Voir `DEPLOY.md`

---

## 🆘 Besoin d'Aide ?

Consultez la documentation complète dans **DEPLOY.md** pour:
- Guide détaillé étape par étape
- Migration des données existantes
- Troubleshooting
- Commandes utiles
- Configuration de la sécurité

---

## 🎨 Fonctionnalités Déployées

✅ Dashboard avec statistiques en temps réel  
✅ Gestion des influenceurs multi-plateformes (Instagram, TikTok, YouTube)  
✅ Pipeline de projets (Kanban)  
✅ Calendrier de planification  
✅ Comparateur d'influenceurs  
✅ Système de scoring automatique  
✅ Tracking des performances  
✅ Design glassmorphism responsive  
✅ Recherche avancée multi-critères  

---

Bon déploiement ! 🚀
