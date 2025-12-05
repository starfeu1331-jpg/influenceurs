"""
Script pour extraire automatiquement les stats des influenceurs depuis les images PNG
Utilise OCR (pytesseract) pour lire le texte dans les images
"""

import os
import json
import re
from pathlib import Path
from PIL import Image
import pytesseract

# Chemin vers le dossier des stats
STATS_DIR = Path(r"C:\Users\Utilisateur\Documents\DEV\INFLUENCEURS\data-import\POUR INFLU\PNG")

# Mapping des noms de dossiers vers les noms d'influenceurs
INFLUENCER_MAPPING = {
    'harold insta': {'name': 'Jore Jardin (Harold)', 'platform': 'INSTAGRAM'},
    'HAROLD TIKTOK': {'name': 'Jore Jardin (Harold)', 'platform': 'TIKTOK'},
    'INSTA AURELIA': {'name': 'Aurelia (Villa Mahana Cassis)', 'platform': 'INSTAGRAM'},
    'TIKTOK AURELIA': {'name': 'Aurelia (Villa Mahana Cassis)', 'platform': 'TIKTOK'},
    'Stats-réseaux': {'name': 'Mathilde Menier', 'platform': 'INSTAGRAM'},
    'stats yann youtube': {'name': 'Yann (Petit Copeau)', 'platform': 'YOUTUBE'},
    'STATS OLIVIA DEC': {'name': 'Olivia (Mum Dalma)', 'platform': 'INSTAGRAM'},
    'pdf24_converted 3': {'name': 'Benjamin', 'platform': 'INSTAGRAM'},
    'pdf24_converted 4': {'name': 'Benjamin', 'platform': 'YOUTUBE'},
    'stats renovateurs du dimanche novembre 2025': {'name': 'Rénovateurs du Dimanche (Ange et Violette)', 'platform': 'INSTAGRAM'},
    'STATS INSTAGRAM BRICOMONT': {'name': 'Marie Lys (Bricomont)', 'platform': 'INSTAGRAM'},
    'STATS TIKTOK BRICOMONT': {'name': 'Marie Lys (Bricomont)', 'platform': 'TIKTOK'},
    'YOUTUBE MARC & SANDY': {'name': 'Marc & Sandy', 'platform': 'YOUTUBE'},
    'youtube aladdin': {'name': 'Aladdin', 'platform': 'YOUTUBE'},
    'STATS INSTA': {'name': 'Aladdin', 'platform': 'INSTAGRAM'},
    'Youtube Statistiques 1 (7)': {'name': 'Charley et Charlotte', 'platform': 'YOUTUBE'},
    'STATS INSTA TED': {'name': 'Ted & Lisa', 'platform': 'INSTAGRAM'},
    'STATS GUILLAUME': {'name': 'Rénovaventure (Guillaume)', 'platform': 'INSTAGRAM'},
}

def extract_number(text):
    """Extrait le plus grand nombre d'un texte (followers/abonnés)"""
    # Chercher des patterns comme "145K", "1.2M", "50000"
    patterns = [
        r'(\d+[\.,]?\d*)\s*[Mm]',  # Millions: 1.2M, 1,2M
        r'(\d+[\.,]?\d*)\s*[Kk]',  # Milliers: 145K, 145k
        r'(\d{3,})',                # Nombres directs: 50000
    ]
    
    numbers = []
    for pattern in patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            num_str = match.replace(',', '.').replace(' ', '')
            try:
                if 'M' in text or 'm' in text:
                    numbers.append(float(num_str) * 1000000)
                elif 'K' in text or 'k' in text:
                    numbers.append(float(num_str) * 1000)
                else:
                    numbers.append(float(num_str))
            except:
                pass
    
    return int(max(numbers)) if numbers else None

def extract_stats_from_image(image_path):
    """Utilise OCR pour extraire le texte d'une image"""
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang='fra')
        
        # Chercher les followers/abonnés
        followers = extract_number(text)
        
        return {
            'text': text,
            'followers': followers
        }
    except Exception as e:
        print(f"Erreur lecture {image_path}: {e}")
        return None

def scan_stats_directory():
    """Scanne tous les dossiers et extrait les stats"""
    influencers = {}
    
    for folder_name, mapping in INFLUENCER_MAPPING.items():
        folder_path = STATS_DIR / folder_name
        
        if not folder_path.exists():
            print(f"⚠️  Dossier non trouvé: {folder_path}")
            continue
        
        print(f"📂 Scan de {folder_name}...")
        
        # Chercher les PNG dans le dossier
        png_files = list(folder_path.glob('*.png'))
        
        if not png_files:
            print(f"  ⚠️  Aucun PNG trouvé")
            continue
        
        # Prendre la première image (souvent c'est le résumé)
        first_png = png_files[0]
        stats = extract_stats_from_image(first_png)
        
        if stats and stats['followers']:
            name = mapping['name']
            platform = mapping['platform']
            
            if name not in influencers:
                influencers[name] = {
                    'name': name,
                    'platforms': []
                }
            
            influencers[name]['platforms'].append({
                'platform': platform,
                'followers': stats['followers'],
                'isMain': len(influencers[name]['platforms']) == 0  # Premier = principal
            })
            
            print(f"  ✅ {platform}: {stats['followers']:,} followers")
        else:
            print(f"  ❌ Impossible d'extraire les stats")
    
    return list(influencers.values())

def main():
    print("🚀 Extraction automatique des stats depuis les PNG...\n")
    
    # Vérifier que pytesseract est installé
    try:
        pytesseract.get_tesseract_version()
    except:
        print("❌ Tesseract OCR n'est pas installé!")
        print("\n📥 Installation requise:")
        print("1. Télécharger: https://github.com/UB-Mannheim/tesseract/wiki")
        print("2. Installer Tesseract")
        print("3. pip install pytesseract pillow")
        return
    
    influencers = scan_stats_directory()
    
    # Sauvegarder en JSON
    output_file = Path(__file__).parent / 'extracted-influencers.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(influencers, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Données extraites: {len(influencers)} influenceurs")
    print(f"📄 Fichier généré: {output_file}")
    
    # Afficher résumé
    print("\n📊 RÉSUMÉ:")
    for inf in influencers:
        print(f"\n{inf['name']}:")
        for p in inf['platforms']:
            main_indicator = " (principale)" if p['isMain'] else ""
            print(f"  • {p['platform']}: {p['followers']:,} followers{main_indicator}")

if __name__ == '__main__':
    main()
