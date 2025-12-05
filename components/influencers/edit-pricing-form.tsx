'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { updateInfluencerPricing } from '@/lib/actions/pricing';
import { BASE_PRICES } from '@/lib/pricing/pricing';

interface PricingFormProps {
  influencerId: string;
  existingPricing: { formatType: string; price: number }[];
  followers?: number;
}

export default function EditPricingForm({ influencerId, existingPricing, followers }: PricingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pricing, setPricing] = useState<Record<string, string>>({});

  // Format definitions with emojis
  const FORMATS = [
    { key: 'REEL', label: '📸 Reel Instagram', base: 800 },
    { key: 'STORY', label: '📱 Story Instagram', base: 200 },
    { key: 'STORY_SET', label: '📲 Set de Stories', base: 500 },
    { key: 'POST_FEED', label: '🖼️ Post Feed', base: 600 },
    { key: 'POST_CARROUSEL', label: '🎠 Carrousel', base: 700 },
    { key: 'TIKTOK_VIDEO', label: '🎵 Vidéo TikTok', base: 600 },
    { key: 'TIKTOK_SERIE', label: '📹 Série TikTok', base: 1500 },
    { key: 'YOUTUBE_VIDEO', label: '📺 Vidéo YouTube', base: 2000 },
    { key: 'YOUTUBE_SHORT', label: '⚡ Short YouTube', base: 500 },
    { key: 'YOUTUBE_INTEGRATION', label: '🎬 Intégration YouTube', base: 1500 },
    { key: 'OTHER', label: '📄 Autre', base: 500 },
  ];

  // Calculate suggested price based on followers
  const getSuggestedPrice = (basePrice: number) => {
    if (!followers) return basePrice;
    
    let multiplier = 1.0;
    if (followers < 10000) multiplier = 0.5;
    else if (followers < 50000) multiplier = 0.8;
    else if (followers < 100000) multiplier = 1.0;
    else if (followers < 500000) multiplier = 1.5;
    else if (followers < 1000000) multiplier = 2.0;
    else multiplier = 3.0;
    
    return Math.round(basePrice * multiplier);
  };

  // Initialize pricing from existing data
  useEffect(() => {
    const initialPricing: Record<string, string> = {};
    existingPricing.forEach(p => {
      initialPricing[p.formatType] = p.price.toString();
    });
    setPricing(initialPricing);
  }, [existingPricing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert to array format
    const pricingArray = Object.entries(pricing)
      .filter(([_, value]) => value && parseFloat(value) > 0)
      .map(([formatType, value]) => ({
        formatType,
        price: parseFloat(value),
      }));

    const result = await updateInfluencerPricing(influencerId, pricingArray);

    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error || 'Erreur lors de la mise à jour');
    }

    setIsSubmitting(false);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            💰 Définir les Tarifs
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Configure les prix de l'influenceur par format de contenu
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {FORMATS.map(format => {
              const suggested = getSuggestedPrice(format.base);
              const currentValue = pricing[format.key] || '';
              
              return (
                <div key={format.key} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-gray-800">
                      {format.label}
                    </label>
                    <div className="text-xs text-gray-500">
                      Base: {format.base}€
                      {followers && ` → Suggéré: ${suggested}€`}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={suggested.toString()}
                      value={currentValue}
                      onChange={(e) => setPricing({ ...pricing, [format.key]: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <span className="text-gray-600 font-medium">€</span>
                    
                    {currentValue && parseFloat(currentValue) !== suggested && (
                      <button
                        type="button"
                        onClick={() => setPricing({ ...pricing, [format.key]: suggested.toString() })}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Auto
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <span className="text-blue-600">💡</span>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Comment ça marche ?</p>
                <ul className="space-y-1 text-xs">
                  <li>• Laisse vide pour utiliser le tarif auto (base × followers)</li>
                  <li>• Remplis pour définir un prix personnalisé</li>
                  <li>• Ces tarifs seront utilisés pour calculer le potentiel ROI</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
      >
        <span>💰</span>
        <span className="font-medium">Tarifs</span>
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
}
