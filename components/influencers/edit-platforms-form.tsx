'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateInfluencerPlatforms } from '@/lib/actions/influencers';

type Platform = {
  id: string;
  platform: 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'OTHER';
  username: string | null;
  profileUrl: string | null;
  followers: number | null;
  isMain: boolean;
};

const platformLabels: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
  OTHER: 'Autre',
};

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

  // État local des plateformes
  const [platforms, setPlatforms] = useState<{
    instagram: { enabled: boolean; username: string; followers: string; url: string; isMain: boolean };
    tiktok: { enabled: boolean; username: string; followers: string; url: string; isMain: boolean };
    youtube: { enabled: boolean; username: string; followers: string; url: string; isMain: boolean };
    other: { enabled: boolean; username: string; followers: string; url: string; isMain: boolean };
  }>(() => {
    const instagram = initialPlatforms.find(p => p.platform === 'INSTAGRAM');
    const tiktok = initialPlatforms.find(p => p.platform === 'TIKTOK');
    const youtube = initialPlatforms.find(p => p.platform === 'YOUTUBE');
    const other = initialPlatforms.find(p => p.platform === 'OTHER');

    return {
      instagram: {
        enabled: !!instagram,
        username: instagram?.username || '',
        followers: instagram?.followers?.toString() || '',
        url: instagram?.profileUrl || '',
        isMain: instagram?.isMain || false,
      },
      tiktok: {
        enabled: !!tiktok,
        username: tiktok?.username || '',
        followers: tiktok?.followers?.toString() || '',
        url: tiktok?.profileUrl || '',
        isMain: tiktok?.isMain || false,
      },
      youtube: {
        enabled: !!youtube,
        username: youtube?.username || '',
        followers: youtube?.followers?.toString() || '',
        url: youtube?.profileUrl || '',
        isMain: youtube?.isMain || false,
      },
      other: {
        enabled: !!other,
        username: other?.username || '',
        followers: other?.followers?.toString() || '',
        url: other?.profileUrl || '',
        isMain: other?.isMain || false,
      },
    };
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
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour des plateformes');
    } finally {
      setLoading(false);
    }
  };

  const handleMainChange = (platform: 'instagram' | 'tiktok' | 'youtube' | 'other') => {
    setPlatforms(prev => ({
      instagram: { ...prev.instagram, isMain: platform === 'instagram' },
      tiktok: { ...prev.tiktok, isMain: platform === 'tiktok' },
      youtube: { ...prev.youtube, isMain: platform === 'youtube' },
      other: { ...prev.other, isMain: platform === 'other' },
    }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-apple-blue-500 text-white rounded-apple hover:bg-apple-blue-600 transition-colors text-callout font-medium shadow-apple-sm"
      >
        ⚙️ Configurer les plateformes
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-glass shadow-apple-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 glass border-b border-apple-gray-200/30 px-6 py-4 rounded-t-apple-lg">
              <h2 className="text-title-2 font-semibold text-apple-gray-900">
                Configurer les plateformes
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Instagram */}
                <div className="border border-apple-gray-200 rounded-apple-lg p-4 bg-gradient-to-br from-pink-50 to-purple-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="instagram-enabled"
                      name="instagram-enabled"
                      checked={platforms.instagram.enabled}
                      onChange={(e) => setPlatforms(prev => ({
                        ...prev,
                        instagram: { ...prev.instagram, enabled: e.target.checked }
                      }))}
                      className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                    />
                    <label htmlFor="instagram-enabled" className="font-semibold text-headline text-gray-900">
                      📸 Instagram
                    </label>
                  </div>

                  {platforms.instagram.enabled && (
                    <div className="space-y-3 ml-8">
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">Nom d'utilisateur</label>
                        <input
                          type="text"
                          name="instagram-username"
                          value={platforms.instagram.username}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            instagram: { ...prev.instagram, username: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">Nombre d'abonnés</label>
                        <input
                          type="number"
                          name="instagram-followers"
                          value={platforms.instagram.followers}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            instagram: { ...prev.instagram, followers: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="10000"
                        />
                      </div>
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">URL du profil</label>
                        <input
                          type="url"
                          name="instagram-url"
                          value={platforms.instagram.url}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            instagram: { ...prev.instagram, url: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="instagram-main"
                          name="main-platform"
                          value="instagram"
                          checked={platforms.instagram.isMain}
                          onChange={() => handleMainChange('instagram')}
                          className="w-4 h-4 text-pink-500 focus:ring-pink-500"
                        />
                        <label htmlFor="instagram-main" className="text-callout text-gray-700">
                          Plateforme principale
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* TikTok */}
                <div className="border border-apple-gray-200 rounded-apple-lg p-4 bg-gradient-to-br from-gray-50 to-teal-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="tiktok-enabled"
                      name="tiktok-enabled"
                      checked={platforms.tiktok.enabled}
                      onChange={(e) => setPlatforms(prev => ({
                        ...prev,
                        tiktok: { ...prev.tiktok, enabled: e.target.checked }
                      }))}
                      className="w-5 h-5 text-teal-500 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="tiktok-enabled" className="font-semibold text-headline text-gray-900">
                      🎵 TikTok
                    </label>
                  </div>

                  {platforms.tiktok.enabled && (
                    <div className="space-y-3 ml-8">
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">Nom d'utilisateur</label>
                        <input
                          type="text"
                          name="tiktok-username"
                          value={platforms.tiktok.username}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            tiktok: { ...prev.tiktok, username: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">Nombre d'abonnés</label>
                        <input
                          type="number"
                          name="tiktok-followers"
                          value={platforms.tiktok.followers}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            tiktok: { ...prev.tiktok, followers: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="10000"
                        />
                      </div>
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">URL du profil</label>
                        <input
                          type="url"
                          name="tiktok-url"
                          value={platforms.tiktok.url}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            tiktok: { ...prev.tiktok, url: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="https://tiktok.com/@username"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="tiktok-main"
                          name="main-platform"
                          value="tiktok"
                          checked={platforms.tiktok.isMain}
                          onChange={() => handleMainChange('tiktok')}
                          className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                        />
                        <label htmlFor="tiktok-main" className="text-callout text-gray-700">
                          Plateforme principale
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* YouTube */}
                <div className="border border-apple-gray-200 rounded-apple-lg p-4 bg-gradient-to-br from-red-50 to-orange-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="youtube-enabled"
                      name="youtube-enabled"
                      checked={platforms.youtube.enabled}
                      onChange={(e) => setPlatforms(prev => ({
                        ...prev,
                        youtube: { ...prev.youtube, enabled: e.target.checked }
                      }))}
                      className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                    />
                    <label htmlFor="youtube-enabled" className="font-semibold text-headline text-gray-900">
                      ▶️ YouTube
                    </label>
                  </div>

                  {platforms.youtube.enabled && (
                    <div className="space-y-3 ml-8">
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">Nom d'utilisateur</label>
                        <input
                          type="text"
                          name="youtube-username"
                          value={platforms.youtube.username}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            youtube: { ...prev.youtube, username: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">Nombre d'abonnés</label>
                        <input
                          type="number"
                          name="youtube-followers"
                          value={platforms.youtube.followers}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            youtube: { ...prev.youtube, followers: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="10000"
                        />
                      </div>
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">URL du profil</label>
                        <input
                          type="url"
                          name="youtube-url"
                          value={platforms.youtube.url}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            youtube: { ...prev.youtube, url: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="https://youtube.com/@username"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="youtube-main"
                          name="main-platform"
                          value="youtube"
                          checked={platforms.youtube.isMain}
                          onChange={() => handleMainChange('youtube')}
                          className="w-4 h-4 text-red-500 focus:ring-red-500"
                        />
                        <label htmlFor="youtube-main" className="text-callout text-gray-700">
                          Plateforme principale
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Other */}
                <div className="border border-apple-gray-200 rounded-apple-lg p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="other-enabled"
                      name="other-enabled"
                      checked={platforms.other.enabled}
                      onChange={(e) => setPlatforms(prev => ({
                        ...prev,
                        other: { ...prev.other, enabled: e.target.checked }
                      }))}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="other-enabled" className="font-semibold text-headline text-gray-900">
                      🌐 Autre plateforme
                    </label>
                  </div>

                  {platforms.other.enabled && (
                    <div className="space-y-3 ml-8">
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">Nom d'utilisateur</label>
                        <input
                          type="text"
                          name="other-username"
                          value={platforms.other.username}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            other: { ...prev.other, username: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">Nombre d'abonnés</label>
                        <input
                          type="number"
                          name="other-followers"
                          value={platforms.other.followers}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            other: { ...prev.other, followers: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10000"
                        />
                      </div>
                      <div>
                        <label className="block text-callout text-gray-700 mb-1">URL du profil</label>
                        <input
                          type="url"
                          name="other-url"
                          value={platforms.other.url}
                          onChange={(e) => setPlatforms(prev => ({
                            ...prev,
                            other: { ...prev.other, url: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-apple focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="other-main"
                          name="main-platform"
                          value="other"
                          checked={platforms.other.isMain}
                          onChange={() => handleMainChange('other')}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor="other-main" className="text-callout text-gray-700">
                          Plateforme principale
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-apple-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-apple-gray-700 hover:bg-apple-gray-100 rounded-apple transition-colors text-callout font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-apple-blue-500 text-white rounded-apple hover:bg-apple-blue-600 transition-colors text-callout font-medium shadow-apple-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
