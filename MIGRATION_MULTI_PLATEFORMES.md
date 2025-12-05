# Migration vers Multi-Plateformes

## 🎯 Changements

L'application passe d'un système **1 plateforme par influenceur** à **plusieurs plateformes par influenceur**.

### Ancien modèle
```prisma
model Influencer {
  mainPlatform String  // UNE seule plateforme
  profileUrl   String?
  followers    Int?
}
```

### Nouveau modèle
```prisma
model Influencer {
  platforms InfluencerPlatform[] // PLUSIEURS plateformes
}

model InfluencerPlatform {
  platform   String   // INSTAGRAM, TIKTOK, YOUTUBE, OTHER
  profileUrl String?
  followers  Int?
  username   String?
  isMain     Boolean  // Marquer la plateforme principale
}
```

## 📝 Étapes de migration

### 1. Arrêter le serveur
```bash
# Ctrl+C dans le terminal du serveur
```

### 2. Appliquer le nouveau schéma
```bash
npx prisma db push
```

⚠️ **ATTENTION**: Cela va **supprimer** les colonnes `mainPlatform`, `profileUrl`, `followers` de la table `Influencer`. Les données existantes seront perdues.

### 3. Régénérer le client Prisma
```bash
npx prisma generate
```

### 4. Redémarrer le serveur
```bash
npm run dev
```

## ✨ Nouvelles fonctionnalités

### Création d'influenceur
- Ajout de **plusieurs plateformes** simultanément
- Champs par plateforme : username, abonnés, URL profil
- Marquage de la **plateforme principale** (⭐)

### Liste des influenceurs
- Affichage de **toutes les plateformes** avec badges
- Filtre par plateforme (fonctionne avec toutes les plateformes d'un influenceur)
- Total des abonnés = **somme de toutes les plateformes**

### Fiche influenceur
- Vue complète de toutes les plateformes
- Stats et scores **par plateforme** (optionnel)
- Score global tous réseaux confondus

### Scoring
- Calcul de scores **par plateforme** ET **score global**
- Permet de comparer les performances d'un influenceur sur différents réseaux

## 🔧 Migration des données existantes

Si vous aviez des données dans l'ancienne structure, vous devrez:

1. **Exporter les données** avant la migration
2. Appliquer le nouveau schéma
3. **Ré-importer** manuellement les plateformes pour chaque influenceur

Ou simplement **repartir à zéro** si c'est plus simple (recommandé en dev).

## 🎨 Interface utilisateur

### Formulaire de création
- ✅ Checkboxes pour activer chaque plateforme
- ✅ Champs spécifiques par plateforme (username, followers, URL)
- ✅ Radio button "Plateforme principale"

### Cards influenceurs
- ✅ Badges multiples avec icônes (📸🎵▶️🌐)
- ✅ Étoile ⭐ sur la plateforme principale
- ✅ Total des abonnés agrégé

### Page détail
- ✅ Grid de toutes les plateformes
- ✅ Stats détaillées par plateforme
- ✅ Liens vers chaque profil

## 🚀 Avantages

1. **Précision**: Tracking exact des audiences par réseau
2. **Comparaison**: Comparer les performances Instagram vs TikTok du même influenceur
3. **Flexibilité**: Ajouter/retirer des plateformes dynamiquement
4. **ROI**: Calculer le ROI par plateforme
5. **Stratégie**: Identifier quelle plateforme privilégier pour chaque influenceur
