# Prompt pour ChatGPT (extraction de stats d'influenceurs)

## Instructions à copier-coller dans ChatGPT

```
Je vais t'envoyer plusieurs captures d'écran de statistiques d'influenceurs (Instagram, TikTok, YouTube).

Pour chaque image, extrait UNIQUEMENT ces informations au format JSON :

{
  "platform": "INSTAGRAM" | "TIKTOK" | "YOUTUBE",
  "followers": 123456,
  "engagement_rate": 2.5 (optionnel, si visible),
  "avg_views": 50000 (optionnel, si visible)
}

**RÈGLES IMPORTANTES** :
- Pour "followers" : prends le NOMBRE TOTAL D'ABONNÉS (pas les vues, pas les likes)
- Ignore tous les autres chiffres (likes, commentaires, reach, etc.)
- Convertis K en milliers (ex: 45.2K = 45200)
- Convertis M en millions (ex: 1.2M = 1200000)
- Si tu vois plusieurs nombres, prends celui qui est explicitement marqué "abonnés" / "followers" / "subscribers"

**EXEMPLE** :
Si tu vois "145K abonnés" → retourne `{"platform": "INSTAGRAM", "followers": 145000}`
Si tu vois "2.3M subscribers" → retourne `{"platform": "YOUTUBE", "followers": 2300000}`

Génère UN objet JSON par image, rien d'autre.
```

## Comment utiliser

1. Ouvre ChatGPT (version avec vision/images)
2. Copie-colle le prompt ci-dessus
3. Upload les images une par une (ou par lot si elles concernent le même influenceur)
4. ChatGPT va te donner les JSON
5. Copie tous les JSON dans un fichier `extracted-data.json` dans ce dossier
6. Je pourrai ensuite les importer automatiquement dans la base de données

## Mapping des dossiers → Influenceurs

Pour faciliter, voici la correspondance :

- `harold insta` → Jore Jardin (Harold) - Instagram
- `HAROLD TIKTOK` → Jore Jardin (Harold) - TikTok
- `INSTA AURELIA` → Aurelia (Villa Mahana Cassis) - Instagram
- `TIKTOK AURELIA` → Aurelia (Villa Mahana Cassis) - TikTok
- `Stats-réseaux` → Mathilde Menier - Instagram
- `stats yann youtube` → Yann (Petit Copeau) - YouTube
- `STATS OLIVIA DEC` → Olivia (Mum Dalma) - Instagram
- `pdf24_converted 3` → Benjamin - Instagram
- `pdf24_converted 4` → Benjamin - YouTube
- `stats renovateurs du dimanche novembre 2025` → Rénovateurs du Dimanche (Ange et Violette) - Instagram
- `STATS INSTAGRAM BRICOMONT` → Marie Lys (Bricomont) - Instagram
- `STATS TIKTOK BRICOMONT` → Marie Lys (Bricomont) - TikTok
- `YOUTUBE MARC & SANDY` → Marc & Sandy - YouTube
- `youtube aladdin` → Aladdin - YouTube
- `STATS INSTA` → Aladdin - Instagram
- `Youtube Statistiques 1 (7)` → Charley et Charlotte - YouTube
- `STATS INSTA TED` → Ted & Lisa - Instagram
- `STATS GUILLAUME` → Rénovaventure (Guillaume) - Instagram
- `VINCENT ET DEBO` → Vincent et Déborah - Instagram

## Format final attendu

Une fois que ChatGPT t'a donné tous les JSON, crée un fichier `extracted-data.json` dans ce format :

```json
{
  "Jore Jardin (Harold)": {
    "instagram": 50000,
    "tiktok": 80000
  },
  "Aurelia (Villa Mahana Cassis)": {
    "instagram": 140000,
    "tiktok": 35000
  },
  ...
}
```

Ensuite, je pourrai lancer le script d'import automatique.
