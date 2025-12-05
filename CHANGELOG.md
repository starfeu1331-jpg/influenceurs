# Changelog

## [2.0.0] - 2025-12-05 - SYSTÈME MULTI-PLATEFORMES 🚀

### 🎉 Fonctionnalité majeure

#### Gestion multi-plateformes
- **BREAKING CHANGE**: Transformation du modèle de données
- Un influenceur peut maintenant être présent sur plusieurs plateformes simultanément
- Support de 4 plateformes : Instagram, TikTok, YouTube, Autre
- Chaque plateforme a ses propres métriques : username, abonnés, URL profil
- Marquage de la "plateforme principale" avec une étoile ⭐

### ✨ Nouvelles fonctionnalités

#### Interface de création
- ✅ Formulaire multi-plateformes avec checkboxes
- ✅ Champs dédiés par plateforme (username, followers, URL)
- ✅ Sélection de la plateforme principale
- ✅ Design avec dégradés de couleur par plateforme

#### Liste des influenceurs
- ✅ Affichage de toutes les plateformes avec badges colorés
- ✅ Total agrégé des abonnés (somme de toutes les plateformes)
- ✅ Icônes distinctives : 📸 Instagram, 🎵 TikTok, ▶️ YouTube, 🌐 Autre
- ✅ Étoile ⭐ sur la plateforme principale
- ✅ Filtre par plateforme (recherche dans toutes les plateformes de l'influenceur)
- ✅ Tri par total d'abonnés multi-plateformes

#### Fiche influenceur
- ✅ Grid visuelle de toutes les plateformes
- ✅ Affichage détaillé par plateforme (username, abonnés, lien)
- ✅ Badge "Principale" sur la plateforme prioritaire
- ✅ Total des abonnés tous réseaux confondus
- ✅ Liens cliquables vers chaque profil social

#### Comparateur
- ✅ Affichage des plateformes dans la sélection
- ✅ Comparaison avec totaux multi-plateformes
- ✅ Badges pour identifier rapidement les réseaux de chaque influenceur

#### Scoring
- ✅ Ajout du champ `platform` dans le modèle Score
- ✅ Permet le scoring par plateforme (à implémenter)
- ✅ Score global (platform = null) pour tous réseaux confondus

### 🗄️ Modifications de la base de données

#### Nouveau modèle
```prisma
model InfluencerPlatform {
  id           String   @id @default(cuid())
  influencer   Influencer
  influencerId String
  
  platform     String   // INSTAGRAM, TIKTOK, YOUTUBE, OTHER
  profileUrl   String?
  followers    Int?
  username     String?
  isMain       Boolean  @default(false)
  
  @@unique([influencerId, platform])
}
```

#### Suppression
- ❌ Champ `mainPlatform` de Influencer (remplacé par relation)
- ❌ Champ `profileUrl` de Influencer (déplacé dans InfluencerPlatform)
- ❌ Champ `followers` de Influencer (déplacé dans InfluencerPlatform)

#### Modifications
- ➕ Ajout du champ `platform` (optionnel) dans Score

### 📝 Fichiers modifiés

#### Schéma Prisma
- `prisma/schema.prisma` - Nouveau modèle InfluencerPlatform

#### Pages
- `app/influencers/page.tsx` - Liste avec badges multi-plateformes
- `app/influencers/new/page.tsx` - Formulaire multi-plateformes
- `app/influencers/[id]/page.tsx` - Affichage détaillé des plateformes
- `app/influencers/compare/page.tsx` - Include platforms

#### Actions
- `lib/actions/influencers.ts` - Création avec plateformes multiples

#### Composants
- `components/comparisons/comparison-form.tsx` - Support multi-plateformes

#### Documentation
- `MIGRATION_INSTRUCTIONS.md` - Guide de migration détaillé
- `MIGRATION_MULTI_PLATEFORMES.md` - Explications techniques
- `MULTI_PLATEFORMES_OVERVIEW.md` - Vue d'ensemble visuelle
- `STATUS.md` - Mise à jour du statut
- `README.md` - Instructions de migration
- `CHANGELOG.md` - Ce fichier

#### Scripts
- `scripts/migrate-to-multiplatform.ts` - Script de migration (référence)

### 🔧 Migration

**BREAKING CHANGE** : Cette version nécessite une migration de base de données.

```bash
npx prisma db push
npx prisma generate
```

⚠️ **Les données existantes seront perdues** (mainPlatform, profileUrl, followers).  
En environnement de développement, il est recommandé de repartir à zéro.

### 🎯 Cas d'usage

1. **Influenceur multi-réseaux** : Marie avec 50K sur Instagram, 120K sur TikTok, 15K sur YouTube
2. **Spécialiste mono-plateforme** : Thomas avec 500K sur YouTube uniquement
3. **Comparaison inter-plateformes** : Qui est meilleur sur TikTok ? Sur Instagram ?
4. **ROI par plateforme** : Calculer la rentabilité selon le réseau social
5. **Stratégie ciblée** : Identifier quelle plateforme privilégier pour chaque collaboration

### 📊 Avantages

- ✅ **Précision** : Tracking exact des audiences par réseau social
- ✅ **Réalisme** : Reflète la réalité (la plupart des influenceurs sont multi-plateformes)
- ✅ **Flexibilité** : Ajouter/retirer des plateformes dynamiquement
- ✅ **Comparaison** : Comparer les performances d'un influenceur sur différents réseaux
- ✅ **ROI** : Calculer le retour sur investissement par plateforme
- ✅ **Évolution** : Suivre la croissance par réseau social
- ✅ **Stratégie** : Décisions data-driven par plateforme

### 🚧 Fonctionnalités futures suggérées

1. **Scoring par plateforme** : Score Instagram vs Score TikTok
2. **Interface de gestion** : Ajouter/modifier/supprimer des plateformes dans la fiche
3. **Stats par plateforme** : Filtrer les StatsSnapshot et CollaborationStats par réseau
4. **Comparateur avancé** : "Meilleur sur Instagram", "Meilleur sur TikTok"
5. **Graphiques** : Visualisation des performances par plateforme
6. **ROI prédictif par plateforme** : Utiliser l'historique du réseau spécifique

---

## [1.0.0] - 2025-12-04 - VERSION INITIALE

### ✨ Fonctionnalités principales

#### Core System
- ✅ Gestion des influenceurs (CRUD)
- ✅ Liste avec tri et filtres
- ✅ Fiche détaillée complète
- ✅ Système de scoring sur 100 points

#### Scoring
- ✅ 4 composantes avec pondérations dynamiques
  - Impact collaborations (40%)
  - Potentiel organique (25%)
  - Rentabilité (15%)
  - Fit stratégique (20%)
- ✅ Gestion intelligente des données partielles
- ✅ Normalisation des métriques
- ✅ Recalcul à la demande

#### Pipeline de projets
- ✅ 9 statuts de négociation
- ✅ Drag & drop entre colonnes
- ✅ Gestion des priorités
- ✅ Rappels et alertes
- ✅ Suivi des budgets

#### Calendrier
- ✅ Vue mois/trimestre
- ✅ Détection des conflits
- ✅ Navigation temporelle
- ✅ Statistiques

#### Comparateur
- ✅ Sélection 2-5 influenceurs
- ✅ Vue comparative côte à côte
- ✅ Recommandations automatiques
- ✅ Analyse qualitative

#### Base de données
- ✅ 7 tables Prisma
- ✅ Relations CASCADE
- ✅ Timestamps automatiques
- ✅ SQLite (dev) / Postgres-ready (prod)

### 📚 Documentation
- ✅ README.md
- ✅ QUICKSTART.md
- ✅ GUIDE_COMPLET.md
- ✅ INSTALLATION.md
- ✅ ROADMAP_FONCTIONNALITES.md
- ✅ STATUS.md
