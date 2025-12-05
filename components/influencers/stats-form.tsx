'use client';

import { addStatsSnapshot } from '@/lib/actions/stats';

export function StatsForm({ influencerId }: { influencerId: string }) {
  const handleSubmit = async (formData: FormData) => {
    await addStatsSnapshot(influencerId, formData);
  };

  return (
    <form action={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
            Plateforme
          </label>
          <select
            id="platform"
            name="platform"
            required
            className="w-full border rounded px-3 py-2"
            onChange={(e) => {
              const formatSelect = document.getElementById('formatType') as HTMLSelectElement;
              const platform = e.target.value;
              
              formatSelect.innerHTML = '';
              
              if (platform === 'INSTAGRAM') {
                formatSelect.innerHTML = `
                  <option value="REEL">📸 Reel</option>
                  <option value="STORY">📱 Story</option>
                  <option value="STORY_SET">📚 Story Set</option>
                  <option value="POST_FEED">🖼️ Post Feed</option>
                  <option value="POST_CARROUSEL">🎠 Carrousel</option>
                `;
              } else if (platform === 'TIKTOK') {
                formatSelect.innerHTML = `
                  <option value="TIKTOK_VIDEO">🎵 TikTok Video</option>
                  <option value="TIKTOK_SERIE">📺 TikTok Série</option>
                `;
              } else if (platform === 'YOUTUBE') {
                formatSelect.innerHTML = `
                  <option value="YOUTUBE_VIDEO">▶️ YouTube Video</option>
                  <option value="YOUTUBE_SHORT">⚡ YouTube Short</option>
                  <option value="YOUTUBE_INTEGRATION">🔗 YouTube Intégration</option>
                `;
              } else {
                formatSelect.innerHTML = '<option value="OTHER">❓ Autre</option>';
              }
            }}
          >
            <option value="INSTAGRAM">Instagram</option>
            <option value="TIKTOK">TikTok</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>
        <div>
          <label htmlFor="formatType" className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <select
            id="formatType"
            name="formatType"
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="REEL">📸 Reel</option>
            <option value="STORY">📱 Story</option>
            <option value="STORY_SET">📚 Story Set</option>
            <option value="POST_FEED">🖼️ Post Feed</option>
            <option value="POST_CARROUSEL">🎠 Carrousel</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
          Période
        </label>
        <select
          id="period"
          name="period"
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="LAST_15_DAYS">15 jours</option>
          <option value="LAST_30_DAYS">30 jours</option>
          <option value="LAST_3_MONTHS">3 mois</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="avgViews" className="block text-sm font-medium text-gray-700 mb-1">
            Vues moyennes
          </label>
          <input
            type="number"
            id="avgViews"
            name="avgViews"
            required
            min="0"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="avgLikes" className="block text-sm font-medium text-gray-700 mb-1">
            Likes moyens
          </label>
          <input
            type="number"
            id="avgLikes"
            name="avgLikes"
            required
            min="0"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="avgComments" className="block text-sm font-medium text-gray-700 mb-1">
            Commentaires moyens
          </label>
          <input
            type="number"
            id="avgComments"
            name="avgComments"
            required
            min="0"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
      >
        ➕ Ajouter
      </button>
    </form>
  );
}
