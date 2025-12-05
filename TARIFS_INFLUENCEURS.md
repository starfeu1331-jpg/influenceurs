# 💰 Système de Tarification des Influenceurs

## 🎯 Concept

Au lieu de se baser uniquement sur l'historique des collaborations passées (souvent incomplet), le système permet maintenant de **définir les tarifs de chaque influenceur par format de contenu**.

Ces tarifs personnalisés sont ensuite utilisés pour calculer le **potentiel ROI réel** en fonction de leurs stats organiques.

---

## 📊 Nouveau Modèle de Données

### Table `InfluencerPricing`

```prisma
model InfluencerPricing {
  id           String      @id @default(cuid())
  influencer   Influencer  @relation(...)
  influencerId String
  
  formatType   String      // REEL, STORY, TIKTOK_VIDEO, etc.
  price        Float       // Prix en euros
  
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@unique([influencerId, formatType]) // Un seul prix par format
}
```

**Avantages** :
- ✅ Un tarif unique et centralisé par format
- ✅ Modifiable facilement quand les prix évoluent
- ✅ Indépendant de l'historique (peut manquer)
- ✅ Permet le calcul de potentiel AVANT toute collaboration

---

## 🖥️ Interface Utilisateur

### Bouton "💰 Tarifs" sur la Fiche Influenceur

**Localisation** : Page `/influencers/[id]`, section Plateformes

**Fonctionnalités** :
1. Affiche un formulaire modal avec tous les formats
2. Pour chaque format :
   - **Tarif de base** (ex: Reel = 800€)
   - **Tarif suggéré** basé sur les followers (800€ × 0.5 à 3x)
   - **Champ de saisie** pour prix personnalisé
   - **Bouton "Auto"** pour utiliser le tarif suggéré

3. **Aide contextuelle** :
   - Laisser vide = utilise tarif auto
   - Remplir = prix fixe personnalisé
   - Ces tarifs servent au calcul de potentiel

**Exemple visuel** :
```
📸 Reel Instagram
Base: 800€ → Suggéré: 1200€ (150k followers)
[___1500___] € [Auto]

📱 Story Instagram  
Base: 200€ → Suggéré: 300€
[___250___] € [Auto]
```

---

## 🧮 Nouveau Calcul de Potentiel

### Avant (Problématique)

```typescript
// Basé uniquement sur vues organiques
organicPotentialScore = normalizeViews(avgViews)
// Problème: Ne dit rien sur la rentabilité
```

**Limites** :
- ❌ 100k vues = bon score, même si l'influenceur coûte 5000€
- ❌ Ne prend pas en compte le budget
- ❌ Pas de notion de ROI

### Maintenant (Solution)

```typescript
// Basé sur ROI potentiel = vues organiques ÷ prix
potentialCPV = prixFormat / vuesMoyennesOrganiques
organicPotentialScore = evaluateProfitability(potentialCPV).score
```

**Exemple concret** :

**Influenceur A** :
- Reel à 1500€
- Stats organiques : 80k vues moyennes
- **CPV potentiel** : 1500/80000 = **0.01875€/vue** = **1.875¢/vue**
- **Score** : ~55/100 (Bon)

**Influenceur B** :
- Reel à 600€
- Stats organiques : 50k vues moyennes
- **CPV potentiel** : 600/50000 = **0.012€/vue** = **1.2¢/vue**
- **Score** : ~70/100 (Très bon)

**Résultat** : Influenceur B a un meilleur potentiel ROI même avec moins de vues, car son prix est plus raisonnable.

---

## 🔄 Workflow Complet

### 1. Définir les Tarifs

1. Aller sur la fiche influenceur (`/influencers/[id]`)
2. Cliquer sur "💰 Tarifs"
3. Remplir les prix par format (ou laisser auto)
4. Enregistrer

### 2. Saisir les Stats Organiques

1. Section "Stats Organiques"
2. Ajouter les stats par période (15j, 30j, 3 mois)
3. Renseigner plateforme + vues/likes/comments moyens

### 3. Calcul Automatique

Le système calcule automatiquement :
- **CPV potentiel** par format = prix / vues organiques
- **Score de potentiel** basé sur ce CPV
- **Comparaison** avec les benchmarks (0.01¢/vue = excellent, etc.)

### 4. Utilisation dans les Projets

Lors de la création d'un projet :
- **Prix auto-rempli** si tarif défini pour ce format
- **Estimation ROI** basée sur stats organiques + tarifs
- **Comparaison d'influenceurs** plus pertinente

---

## 📈 Impact sur le Scoring

### Pondération Ajustée

Avant :
```
Impact Collabs (40%) + Organique (25%) + Rentabilité (15%) + Fit (20%)
```

Maintenant :
```
Impact Collabs (40%) - Basé sur ROI réel des collabs passées
Potentiel Organique (25%) - Basé sur ROI potentiel (stats × tarifs)
Rentabilité (15%) - CPV moyen historique
Fit Stratégique (20%) - Thème/Géo/Timing
```

### Nouveau Calcul "Potentiel Organique"

```typescript
function computeOrganicPotentialScore(
  influencer: Influencer,
  statsSnapshots: StatsSnapshot[],
  pricing: InfluencerPricing[]
): number {
  // Pour chaque plateforme
  for (const platform of influencer.platforms) {
    // Récupérer stats organiques récentes
    const stats = statsSnapshots.filter(s => s.platform === platform.platform);
    const avgViews = calculateAvgViews(stats);
    
    // Récupérer tarifs de l'influenceur
    const formats = getFormatsForPlatform(platform.platform);
    
    // Calculer CPV potentiel par format
    const potentialScores = formats.map(format => {
      const price = getPriceForFormat(pricing, format);
      const cpv = price / avgViews;
      return evaluateProfitability(cpv).score;
    });
    
    // Moyenne des scores
    return average(potentialScores);
  }
}
```

---

## 💡 Cas d'Usage

### Scénario 1 : Nouvel Influenceur (sans historique)

**Sans le système** :
- Impossible de scorer (pas de collabs passées)
- Difficile de comparer avec d'autres
- Pas de visibilité sur le potentiel ROI

**Avec le système** :
1. Définir ses tarifs (négociés ou suggérés)
2. Ajouter ses stats organiques (publiques)
3. ✅ Score de potentiel calculé immédiatement
4. ✅ Comparaison possible avec d'autres influenceurs
5. ✅ Décision éclairée AVANT de payer

### Scénario 2 : Augmentation de Tarifs

Un influenceur passe de 800€ à 1200€ pour ses Reels.

**Impact** :
- ⚠️ Son CPV potentiel augmente : 800/50k → 1200/50k
- ⚠️ Son score de potentiel baisse : 70/100 → 55/100
- ✅ Le système alerte que le ROI sera moins bon
- ✅ Permet de négocier ou choisir un autre influenceur

### Scénario 3 : Comparaison de 3 Influenceurs

| Influenceur | Followers | Prix Reel | Vues Moyennes | CPV Potentiel | Score |
|-------------|-----------|-----------|---------------|---------------|-------|
| **A** | 500k | 2500€ | 150k | 0.0167€ | 45/100 |
| **B** | 200k | 1000€ | 80k | 0.0125€ | 65/100 |
| **C** | 100k | 600€ | 50k | 0.012€ | 70/100 |

**Analyse** :
- Influenceur **C** a le meilleur ROI potentiel
- Influenceur **A** a plus de reach mais coût/vue trop élevé
- **Décision** : Choisir C ou B selon budget et objectif reach

---

## 🔧 Fonctions API

### `getInfluencerPricing(influencerId)`
Récupère tous les tarifs d'un influenceur.

### `updateInfluencerPricing(influencerId, pricing[])`
Met à jour les tarifs (supprime anciens, crée nouveaux).

### `getInfluencerFormatPrice(influencerId, formatType, followers?)`
Retourne le prix d'un format :
- Prix personnalisé si défini
- Sinon prix de base × multiplicateur followers

---

## 🎨 Design du Formulaire

**Header** :
- Gradient vert (💰 thème monétaire)
- Titre "Définir les Tarifs"
- Sous-titre explicatif

**Body** :
- 11 formats avec icônes
- 3 colonnes d'info : Base, Suggéré, Input
- Bouton "Auto" pour appliquer suggéré
- Infos contextuelles en temps réel

**Footer** :
- Encart bleu avec conseils
- Boutons Annuler / Enregistrer

---

## 📝 Prochaines Évolutions

### Phase 2 : Machine Learning
- Prédiction des performances selon historique
- Ajustement auto des tarifs selon tendances
- Alertes si prix trop élevé vs marché

### Phase 3 : Négociation
- Fourchettes de prix (min/max)
- Historique d'évolution des tarifs
- Comparaison avec concurrents

### Phase 4 : Packages
- Tarifs dégressifs (lot de X posts)
- Packages multi-formats (Reel + Story)
- Exclusivités / Long-terme

---

## ✅ Résumé

**Problème résolu** :
Le scoring ne prenait pas en compte le prix lors du calcul de potentiel organique.

**Solution** :
- Définir les tarifs par format par influenceur
- Calculer CPV potentiel = prix / stats organiques
- Score basé sur rentabilité potentielle, pas juste portée

**Avantages** :
✅ Décisions éclairées AVANT collaboration
✅ Comparaison équitable entre influenceurs
✅ Visibilité sur ROI potentiel
✅ Indépendant de l'historique (peut manquer)

---

*Mis à jour : Décembre 2025*
