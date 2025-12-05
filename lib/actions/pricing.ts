'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { BASE_PRICES, type ContentFormat } from '@/lib/pricing/pricing';

/**
 * Récupérer les tarifs d'un influenceur
 */
export async function getInfluencerPricing(influencerId: string) {
  const pricing = await prisma.influencerPricing.findMany({
    where: { influencerId },
    orderBy: { formatType: 'asc' },
  });
  
  return pricing;
}

/**
 * Mettre à jour ou créer les tarifs d'un influenceur
 */
export async function updateInfluencerPricing(
  influencerId: string,
  pricingData: { formatType: string; price: number }[]
) {
  try {
    // Supprimer les anciens tarifs
    await prisma.influencerPricing.deleteMany({
      where: { influencerId },
    });

    // Créer les nouveaux tarifs (seulement ceux avec un prix > 0)
    const validPricing = pricingData.filter(p => p.price > 0);
    
    if (validPricing.length > 0) {
      await prisma.influencerPricing.createMany({
        data: validPricing.map(p => ({
          influencerId,
          formatType: p.formatType,
          price: p.price,
        })),
      });
    }

    revalidatePath(`/influencers/${influencerId}`);
    revalidatePath('/influencers');

    return { success: true };
  } catch (error) {
    console.error('Error updating influencer pricing:', error);
    return { success: false, error: 'Erreur lors de la mise à jour des tarifs' };
  }
}

/**
 * Obtenir le prix d'un format pour un influenceur
 * Retourne le prix personnalisé si défini, sinon le prix de base
 */
export async function getInfluencerFormatPrice(
  influencerId: string,
  formatType: string,
  followers?: number
): Promise<number> {
  // Chercher le prix personnalisé
  const customPrice = await prisma.influencerPricing.findUnique({
    where: {
      influencerId_formatType: {
        influencerId,
        formatType,
      },
    },
  });

  if (customPrice) {
    return customPrice.price;
  }

  // Sinon, utiliser le prix de base
  const basePrice = BASE_PRICES[formatType as ContentFormat] || BASE_PRICES.OTHER;
  
  // Si on a le nombre de followers, appliquer le multiplicateur
  if (followers) {
    let multiplier = 1.0;
    if (followers < 10000) multiplier = 0.5;
    else if (followers < 50000) multiplier = 0.8;
    else if (followers < 100000) multiplier = 1.0;
    else if (followers < 500000) multiplier = 1.5;
    else if (followers < 1000000) multiplier = 2.0;
    else multiplier = 3.0;
    
    return Math.round(basePrice * multiplier);
  }

  return basePrice;
}
