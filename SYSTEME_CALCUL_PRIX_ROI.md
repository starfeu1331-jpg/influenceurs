# 💰 Système de Calcul de Prix et ROI

## 📊 Vue d'ensemble

Le système de calcul a été entièrement refait pour prendre en compte **le type de contenu et son prix réel**.

Avant : Les calculs étaient basés sur des moyennes globales sans distinction de format.
Maintenant : Chaque format (Reel, Story, TikTok, YouTube) est évalué selon son propre tarif et ses performances.

---

## 💵 Tarifs de Base par Format

### Instagram
- **Reel** : 800€ (base)
- **Story** : 200€
- **Set de Stories** (3-5) : 500€
- **Post Feed** : 600€
- **Carrousel** : 700€

### TikTok
- **Vidéo TikTok** : 600€
- **Série TikTok** (3 vidéos) : 1500€

### YouTube
- **Vidéo YouTube** : 2000€
- **Short YouTube** : 500€
- **Intégration** (dans vidéo existante) : 1500€

### Autres
- **Autre format** : 500€

---

## 📈 Multiplicateurs selon les Followers

Les tarifs de base sont multipliés selon l'audience :

| Followers | Multiplicateur | Type |
|-----------|---------------|------|
| < 10k | 0.5x | Nano |
| 10k - 50k | 0.8x | Micro |
| 50k - 100k | 1.0x | Standard |
| 100k - 500k | 1.5x | Influenceur |
| 500k - 1M | 2.0x | Macro |
| > 1M | 3.0x | Mega |

**Exemple** : Un Reel pour un influenceur à 150k followers = 800€ × 1.5 = **1200€**

---

## 🎯 Calcul du ROI (Return On Investment)

### 1. CPV (Coût Par Vue)
```
CPV = Prix / Nombre de Vues
```

**Exemple** : Reel à 1200€ avec 50k vues = 1200/50000 = **0.024€/vue** = **2.4¢/vue**

### 2. Taux d'Engagement
```
Engagement (%) = (Likes + Comments × 2) / Vues × 100
```

Les commentaires comptent double car ils indiquent un engagement plus fort.

**Exemple** : 
- 50k vues
- 2k likes
- 150 comments

Engagement = (2000 + 150×2) / 50000 × 100 = **4.6%**

### 3. Valeur Générée Estimée
```
Valeur = (Vues × 0.001€) + (Likes × 0.01€) + (Comments × 0.05€)
```

**Exemple** :
- 50k vues → 50€
- 2k likes → 20€
- 150 comments → 7.5€
- **Total = 77.5€** de valeur estimée

### 4. Score ROI (0-100)
Combinaison de :
- **60%** Score CPV (basé sur les benchmarks)
- **40%** Score Engagement

---

## 📉 Benchmarks CPV

Le CPV est évalué selon ces seuils :

| CPV (€/vue) | Notation | Score |
|-------------|----------|-------|
| ≤ 0.0001 | ⭐⭐⭐⭐⭐ Excellent | 100 |
| ≤ 0.0005 | ⭐⭐⭐⭐ Bon | 75 |
| ≤ 0.001 | ⭐⭐⭐ Moyen | 50 |
| ≤ 0.005 | ⭐⭐ Faible | 25 |
| > 0.005 | ⭐ Très faible | 0-25 |

**En centimes par vue** (plus lisible) :
- **0.01¢/vue** = Excellent
- **0.05¢/vue** = Bon
- **0.1¢/vue** = Moyen
- **0.5¢/vue** = Faible

---

## 🧮 Nouveau Système de Scoring Global

### Impact Collaborations (40%)
- **Avant** : Moyenne globale des vues/likes/comments
- **Maintenant** : Score ROI par format, pondéré par nombre de collabs

**Calcul** :
1. Grouper les collaborations par format (Reel, Story, TikTok, etc.)
2. Pour chaque format :
   - Calculer moyennes : vues, likes, comments, prix
   - Calculer ROI score (0-100)
3. Score final = moyenne pondérée des ROI par format

**Avantage** : Un Reel à 1500€ avec 100k vues (bon ROI) compte différemment qu'une Story à 200€ avec 10k vues (aussi bon ROI pour son format).

### Rentabilité (15%)
- **Avant** : CPV unique pour tous les formats
- **Maintenant** : CPV évalué par format selon les benchmarks

**Calcul** :
1. Grouper par format
2. Évaluer chaque CPV selon son benchmark
3. Moyenne pondérée

### Potentiel Organique (25%)
- Inchangé : basé sur les stats organiques récentes

### Fit Stratégique (20%)
- Inchangé : basé sur les scores thème/géo/timing

---

## 📊 Détail des Calculs par Format

Pour chaque format, l'outil affiche maintenant :

### Métriques Affichées
- **Nombre de collaborations** du format
- **Prix moyen** payé
- **Vues moyennes** obtenues
- **CPV** (en centimes)
- **Score ROI** (0-100) avec couleur :
  - 🟢 Vert (≥75) : Excellent
  - 🟡 Jaune (50-74) : Bon
  - 🔴 Rouge (<50) : À améliorer

---

## 💡 Cas d'Usage

### Exemple 1 : Influenceur Mode (250k followers)

**Reel Instagram** :
- Prix : 800€ × 1.5 = 1200€
- Vues : 80k
- Likes : 3.2k
- Comments : 120
- **CPV** : 1200/80000 = 0.015€/vue = **1.5¢/vue**
- **Engagement** : (3200 + 120×2) / 80000 × 100 = **4.3%**
- **Score ROI** : ~65/100 (Bon)

**Story Set** :
- Prix : 500€ × 1.5 = 750€
- Vues : 25k
- Likes : 800
- Comments : 30
- **CPV** : 750/25000 = 0.03€/vue = **3¢/vue**
- **Engagement** : (800 + 30×2) / 25000 × 100 = **3.5%**
- **Score ROI** : ~45/100 (Moyen)

**Score Impact Collabs** :
- 2 collabs Reel (score 65)
- 1 collab Story Set (score 45)
- Moyenne pondérée : (65×2 + 45×1) / 3 = **58.3/100**

### Exemple 2 : Influenceur Tech (500k followers)

**Vidéo YouTube** :
- Prix : 2000€ × 2 = 4000€
- Vues : 200k
- Likes : 8k
- Comments : 450
- **CPV** : 4000/200000 = 0.02€/vue = **2¢/vue**
- **Engagement** : (8000 + 450×2) / 200000 × 100 = **4.5%**
- **Score ROI** : ~55/100 (Bon)

**TikTok Vidéo** :
- Prix : 600€ × 2 = 1200€
- Vues : 150k
- Likes : 12k
- Comments : 800
- **CPV** : 1200/150000 = 0.008€/vue = **0.8¢/vue**
- **Engagement** : (12000 + 800×2) / 150000 × 100 = **9.1%**
- **Score ROI** : ~85/100 (Excellent)

**Score Impact Collabs** :
- 1 collab YouTube (score 55)
- 2 collabs TikTok (score 85)
- Moyenne pondérée : (55×1 + 85×2) / 3 = **75/100**

---

## 🔧 Utilisation dans l'Interface

### 1. Affichage du Score Breakdown
Le composant `ScoreBreakdown` affiche :
- Score global avec pondérations
- Détail par format (prix, vues, CPV, ROI)
- Tarifs de référence

### 2. Saisie des Collaborations
Lors de l'ajout d'une collaboration :
1. Sélectionner le **format** (Reel, Story, TikTok, etc.)
2. Saisir le **prix** (ou laisser vide pour utiliser le tarif de référence)
3. Saisir les **stats** (vues, likes, comments)

Le système calcule automatiquement :
- CPV
- Score ROI
- Impact sur le score global

### 3. Comparaison d'Influenceurs
Le système permet maintenant de comparer :
- ROI par format entre influenceurs
- Prix moyens par format
- Efficacité selon le type de contenu

---

## 🎨 Avantages du Nouveau Système

✅ **Précision** : Chaque format est évalué selon son propre benchmark
✅ **Transparence** : Les calculs sont détaillés et compréhensibles
✅ **Décisions éclairées** : Savoir quel format choisir pour chaque influenceur
✅ **Budget optimisé** : Identifier les meilleurs ROI par format
✅ **Évolutif** : Facile d'ajuster les tarifs et benchmarks

---

## 📝 Notes Techniques

### Fichiers Modifiés
- `lib/pricing/pricing.ts` - Nouveau module de calcul
- `lib/scoring/computeInfluencerScore.ts` - Refonte complète
- `components/scoring/score-breakdown.tsx` - Nouveau composant d'affichage

### Formules Clés
```typescript
// CPV
cpv = price / views

// Engagement
engagement = ((likes + comments * 2) / views) * 100

// Valeur générée
value = views * 0.001 + likes * 0.01 + comments * 0.05

// Score ROI
roiScore = cpvScore * 0.6 + engagementScore * 0.4
```

### Constantes Ajustables
Les constantes suivantes peuvent être modifiées dans `lib/pricing/pricing.ts` :
- `BASE_PRICES` : Tarifs de base par format
- Multiplicateurs de followers (fonction `calculatePrice`)
- Benchmarks CPV (fonction `evaluateProfitability`)
- Poids ROI (60% CPV / 40% engagement dans `calculateROI`)

---

## 🚀 Prochaines Améliorations Possibles

1. **Machine Learning** : Prédiction des performances basée sur l'historique
2. **Saisonnalité** : Ajustement des benchmarks selon la période
3. **Secteur** : Benchmarks spécifiques par industrie (mode, tech, food, etc.)
4. **Audience** : Prise en compte de la qualité de l'audience (% vrai followers)
5. **Timing** : Analyse du meilleur moment pour publier
6. **Tendances** : Détection de hausse/baisse de performance

---

*Dernière mise à jour : Janvier 2025*
