'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { updateInfluencerPlatforms } from '@/lib/actions/influencers';

type Platform = {
  id: string;
  platform: string;
  username: string | null;
  profileUrl: string | null;
  followers: number | null;
  isMain: boolean;
};

type PlatformConfig = {
  key: 'instagram' | 'tiktok' | 'youtube' | 'other';
  enum: string;
  icon: string;
  label: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
};

const PLATFORMS: PlatformConfig[] = [
  { key: 'instagram', enum: 'INSTAGRAM', icon: '📸', label: 'Instagram', gradientFrom: 'from-pink-50', gradientTo: 'to-purple-50', accentColor: 'pink' },
  { key: 'tiktok', enum: 'TIKTOK', icon: '🎵', label: 'TikTok', gradientFrom: 'from-gray-50', gradientTo: 'to-teal-50', accentColor: 'teal' },
  { key: 'youtube', enum: 'YOUTUBE', icon: '▶️', label: 'YouTube', gradientFrom: 'from-red-50', gradientTo: 'to-orange-50', accentColor: 'red' },
  { key: 'other', enum: 'OTHER', icon: '🌐', label: 'Autre', gradientFrom: 'from-blue-50', gradientTo: 'to-purple-50', accentColor: 'blue' },
];

export function EditPlatformsForm({ 
  influencerId, 
  initialPlatforms 
}: { 
  influencerId: string; 
  initialPlatforms: Platform[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // État local pour chaque plateforme
  const [platforms, setPlatforms] = useState(() => {
    const state: Record<string, { enabled: boolean; username: string; followers: string; url: string; isMain: boolean }> = {};
    
    PLATFORMS.forEach(({ key, enum: enumValue }) => {
      const platform = initialPlatforms.find(p => p.platform === enumValue);
      state[key] = {
        enabled: !!platform,
        username: platform?.username || '',
        followers: platform?.followers?.toString() || '',
        url: platform?.profileUrl || '',
        isMain: platform?.isMain || false,
      };
    });
    
    return state;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('influencerId', influencerId);

    try {
      await updateInfluencerPlatforms(formData);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleMainChange = (platformKey: string) => {
    setPlatforms(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = { ...updated[key], isMain: key === platformKey };
      });
      return updated;
    });
  };

  const updatePlatform = (platformKey: string, field: string, value: string | boolean) => {
    setPlatforms(prev => ({
      ...prev,
      [platformKey]: { ...prev[platformKey], [field]: value }
    }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
      >
        ⚙️ Modifier
      </button>

      {mounted && isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">⚙️ Configurer les plateformes</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">⚙️ Configurer les plateformes</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {PLATFORMS.map(({ key, icon, label, gradientFrom, gradientTo, accentColor }) => {
                    const platform = platforms[key];
                    return (
                      <div key={key} className={`border rounded-xl p-4 bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-sm`}>
                        <div className="flex items-center space-x-2 mb-3">
                          <input
                            type="checkbox"
                            id={`${key}-enabled`}
                            name={`${key}-enabled`}
                            checked={platform.enabled}
                            onChange={(e) => updatePlatform(key, 'enabled', e.target.checked)}
                            className="w-5 h-5 rounded"
                          />
                          <label htmlFor={`${key}-enabled`} className="font-semibold text-base cursor-pointer">
                            {icon} {label}
                          </label>
                        </div>

                        {platform.enabled && (
                          <div className="space-y-3 ml-7 mt-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                              <input
                                type="text"
                                name={`${key}-username`}
                                value={platform.username}
                                onChange={(e) => updatePlatform(key, 'username', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="@username"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Abonnés</label>
                              <input
                                type="number"
                                name={`${key}-followers`}
                                value={platform.followers}
                                onChange={(e) => updatePlatform(key, 'followers', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="10000"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">URL profil</label>
                              <input
                                type="url"
                                name={`${key}-url`}
                                value={platform.url}
                                onChange={(e) => updatePlatform(key, 'url', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://..."
                              />
                            </div>
                            <label className="flex items-center space-x-2 text-sm bg-white/60 rounded-lg p-2 cursor-pointer hover:bg-white/80 transition-colors">
                              <input
                                type="radio"
                                name="main-platform"
                                value={key}
                                checked={platform.isMain}
                                onChange={() => handleMainChange(key)}
                                className="w-4 h-4"
                              />
                              <span className="font-medium">⭐ Plateforme principale</span>
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Enregistrement...' : '✅ Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
