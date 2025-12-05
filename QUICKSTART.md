# 🚀 DÉMARRAGE RAPIDE

## ✅ Votre application est déjà démarrée !

**Accédez à l'application : http://localhost:3000**

---

## 🎯 Premiers pas

### 1. Créer votre premier influenceur
1. Cliquez sur **"+ Nouvel influenceur"**
2. Remplissez au minimum :
   - Nom (ex: "Sophie Réno")
   - Plateforme (ex: Instagram)
3. Cliquez sur **"Créer l'influenceur"**

### 2. Ajouter des données (toutes optionnelles !)
Sur la page de l'influenceur :

**📊 Fit & Cible**
- Décrivez les sujets (rénovation, déco...)
- Notez l'audience (France, Sud...)
- Donnez des scores de 0 à 100

**📈 Stats organiques**
- Ajoutez des snapshots de stats (15j, 30j, 3 mois)
- Indiquez vues, likes, commentaires

**🤝 Collaborations**
- Ajoutez les collabs passées
- Renseignez vues, likes, prix

### 3. Calculer le score
- Cliquez sur **"🔄 Recalculer le score"**
- Le score s'affiche avec détails !

---

## 📊 Exemple avec données de test

Pour tester rapidement l'app avec 2 influenceurs pré-remplis :

```bash
npm run seed
```

Puis rechargez http://localhost:3000

---

## 💡 Astuces

### L'app ne plante jamais
- Pas de données → Pas de calcul, c'est tout
- Données partielles → Calcul avec ce qui existe
- Pondérations automatiques

### Données minimales par composant
- **Impact collabs** : 1+ collab avec vues
- **Potentiel organique** : 1+ snapshot avec vues
- **Rentabilité** : 1+ collab avec prix ET vues
- **Fit stratégique** : 1+ score de fit renseigné

### Navigation
- Liste → Voir tous les influenceurs
- Filtres → Trier par score/abonnés/nom + filtrer par plateforme
- Détail → Tout gérer depuis une seule page

---

## 🛠️ Commandes utiles

```bash
# Visualiser la base de données
npm run db:studio

# Créer des données de test
npm run seed

# Build pour production
npm run build
```

---

## 📁 Où sont mes données ?

`prisma/dev.db` → Base de données SQLite locale

Pour voir/éditer : `npm run db:studio`

---

## ❓ Questions fréquentes

**Q: Je peux calculer un score sans toutes les données ?**
R: Oui ! L'app calcule avec ce que vous avez.

**Q: Comment comparer des influenceurs ?**
R: Sur la page liste, triez par score décroissant.

**Q: Les scores sont sauvegardés ?**
R: Oui, chaque calcul crée un historique.

**Q: Comment déployer en production ?**
R: Voir GUIDE_COMPLET.md section "Déploiement sur Vercel"

---

**Tout est prêt ! Commencez à noter vos influenceurs 🎯**
