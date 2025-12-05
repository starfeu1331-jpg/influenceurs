# 🚀 Migration Multi-Plateformes - Instructions

## ⚠️ IMPORTANT - Actions requises

### 1. **Arrêter le serveur de développement**
Appuyez sur `Ctrl+C` dans le terminal où tourne `npm run dev`

### 2. **Appliquer le nouveau schéma Prisma**
```powershell
npx prisma db push
```

⚠️ **ATTENTION**: Cette commande va:
- Supprimer les colonnes `mainPlatform`, `profileUrl`, `followers` de la table `Influencer`
- Créer une nouvelle table `InfluencerPlatform`
- **PERDRE les données existantes** (normal en développement)

### 3. **Régénérer le client Prisma**
```powershell
npx prisma generate
```

### 4. **Redémarrer le serveur**
```powershell
npm run dev
```

### 5. **Tester la création d'influenceur**
1. Aller sur http://localhost:3000/influencers
2. Cliquer "Nouveau"
3. Remplir le nom
4. **Cocher une ou plusieurs plateformes**
5. Remplir les infos pour chaque plateforme cochée
6. Marquer la plateforme principale
7. Créer

## ✨ Nouvelles fonctionnalités disponibles

### **Création d'influenceur**
- ✅ Ajout de plusieurs plateformes simultanément
- ✅ Instagram, TikTok, YouTube, Autre
- ✅ Username + Abonnés + URL par plateforme
- ✅ Marquage de la plateforme principale (⭐)

### **Liste des influenceurs**
- ✅ Affichage de toutes les plateformes avec badges colorés
- ✅ Étoile sur la plateforme principale
- ✅ Total des abonnés = somme de toutes les plateformes
- ✅ Filtre par plateforme (fonctionne avec toutes les plateformes)

### **Fiche influenceur**
- ✅ Grid visuelle de toutes les plateformes
- ✅ Stats détaillées par plateforme
- ✅ Liens cliquables vers chaque profil
- ✅ Total agrégé des abonnés

### **Comparateur**
- ✅ Affichage des plateformes dans la sélection
- ✅ Comparaison avec totaux d'abonnés multi-plateformes

### **Scoring**
- ✅ Le modèle Score a maintenant un champ `platform` optionnel
- ✅ Permet de calculer des scores PAR plateforme
- ✅ Score global (platform = null) pour tous réseaux confondus

## 🎯 Prochaines étapes recommandées

### 1. **Améliorer le scoring par plateforme**
Actuellement le scoring est global. On pourrait:
- Calculer un score pour chaque plateforme individuellement
- Comparer les performances Instagram vs TikTok d'un même influenceur
- Afficher des graphiques de performance par réseau

### 2. **Stats et collaborations par plateforme**
Les `StatsSnapshot` et `CollaborationStats` ont déjà un champ `platform`.
On pourrait:
- Filtrer les stats par plateforme dans la fiche influenceur
- Comparer les performances organiques sur chaque réseau
- Identifier la plateforme la plus performante

### 3. **Interface de gestion des plateformes**
Ajouter dans la fiche influenceur:
- Bouton "Ajouter une plateforme"
- Bouton "Modifier plateforme"
- Bouton "Supprimer plateforme"
- Définir/changer la plateforme principale

### 4. **Comparateur avancé par plateforme**
- Comparer les influenceurs sur une plateforme spécifique
- "Qui est le meilleur sur Instagram ?"
- "Qui a le meilleur engagement sur TikTok ?"

### 5. **Prédictions par plateforme dans les projets**
Le modèle `Project` a un champ `platform`. On pourrait:
- Prédire les performances selon la plateforme choisie
- Utiliser l'historique de la plateforme spécifique
- ROI calculé par plateforme

## 🐛 Si vous rencontrez des erreurs

### Erreur "mainPlatform n'existe pas"
➡️ Vous n'avez pas appliqué `npx prisma db push`

### Erreur "Cannot read property 'platforms' of undefined"
➡️ Vous n'avez pas redémarré le serveur après `npx prisma generate`

### Page blanche ou erreur 500
➡️ Vérifiez la console du navigateur et le terminal
➡️ Assurez-vous que la DB a bien été migrée

### Les anciens influenceurs ne s'affichent pas
➡️ Normal, ils n'ont pas de plateformes. Il faut:
- Les supprimer et les recréer
- Ou ajouter manuellement des plateformes via Prisma Studio

## 📊 Vérifier la migration

### Ouvrir Prisma Studio
```powershell
npx prisma studio
```

### Vérifier:
1. Table `Influencer` : colonnes `mainPlatform`, `profileUrl`, `followers` sont supprimées
2. Table `InfluencerPlatform` existe et est vide (ou contient vos nouvelles données)
3. Créer un influenceur et vérifier qu'il apparaît avec ses plateformes

## ✅ Checklist

- [ ] Serveur arrêté
- [ ] `npx prisma db push` exécuté
- [ ] `npx prisma generate` exécuté
- [ ] Serveur redémarré
- [ ] Création d'un influenceur testée
- [ ] Liste des influenceurs s'affiche correctement
- [ ] Fiche détaillée affiche les plateformes

## 🎉 C'est prêt !

Une fois ces étapes terminées, vous avez un système complet de **gestion multi-plateformes** pour vos influenceurs !

Vous pouvez maintenant:
- Tracker précisément les audiences par réseau
- Comparer les performances d'un influenceur sur différentes plateformes
- Calculer le ROI par plateforme
- Identifier quelle plateforme privilégier pour chaque collaboration
