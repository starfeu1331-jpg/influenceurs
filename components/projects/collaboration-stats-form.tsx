'use client';

import { updateCollaborationStats } from '@/lib/actions/collaboration-stats';
import { useState } from 'react';

type Project = {
  id: string;
  platform: string | null;
  formatType: string | null;
};

type CollaborationStats = {
  actualViews: number | null;
  actualLikes: number | null;
  actualComments: number | null;
  actualPrice: number | null;
  publishDate: Date | null;
} | null;

export function CollaborationStatsForm({
  project,
  existingStats,
}: {
  project: Project;
  existingStats: CollaborationStats;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await updateCollaborationStats({
      projectId: project.id,
      platform: formData.get('platform') as string,
      formatType: formData.get('formatType') as string,
      publishDate: formData.get('publishDate')
        ? new Date(formData.get('publishDate') as string)
        : undefined,
      actualViews: formData.get('actualViews') ? parseInt(formData.get('actualViews') as string) : undefined,
      actualLikes: formData.get('actualLikes') ? parseInt(formData.get('actualLikes') as string) : undefined,
      actualComments: formData.get('actualComments')
        ? parseInt(formData.get('actualComments') as string)
        : undefined,
      actualPrice: formData.get('actualPrice') ? parseFloat(formData.get('actualPrice') as string) : undefined,
    });

    setLoading(false);

    if (result.success) {
      alert('✅ Stats de collaboration enregistrées avec succès !');
      window.location.reload();
    } else {
      alert(`❌ Erreur: ${result.error}`);
    }
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className="card-glass p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {existingStats ? '📊 Modifier les stats' : '📊 Ajouter les stats de collaboration'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Plateforme *</label>
            <select
              name="platform"
              defaultValue={existingStats?.actualViews ? project.platform || '' : project.platform || ''}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">-- Sélectionner --</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="TIKTOK">TikTok</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Format * 📊</label>
            <select
              name="formatType"
              defaultValue={existingStats?.actualViews ? project.formatType || '' : project.formatType || ''}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">-- Sélectionner --</option>
              <option value="REEL">📸 Reel Instagram (800€)</option>
              <option value="STORY">📱 Story Instagram (200€)</option>
              <option value="STORY_SET">📲 Set de Stories (500€)</option>
              <option value="POST_FEED">🖼️ Post Feed (600€)</option>
              <option value="POST_CARROUSEL">🎠 Carrousel (700€)</option>
              <option value="TIKTOK_VIDEO">🎵 Vidéo TikTok (600€)</option>
              <option value="TIKTOK_SERIE">📹 Série TikTok (1500€)</option>
              <option value="YOUTUBE_VIDEO">📺 Vidéo YouTube (2000€)</option>
              <option value="YOUTUBE_SHORT">⚡ Short YouTube (500€)</option>
              <option value="YOUTUBE_INTEGRATION">🎬 Intégration YouTube (1500€)</option>
              <option value="OTHER">📄 Autre (500€)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date de publication</label>
          <input
            type="date"
            name="publishDate"
            defaultValue={formatDateForInput(existingStats?.publishDate || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Vues réelles</label>
            <input
              type="number"
              name="actualViews"
              defaultValue={existingStats?.actualViews || ''}
              placeholder="Ex: 85000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Likes réels</label>
            <input
              type="number"
              name="actualLikes"
              defaultValue={existingStats?.actualLikes || ''}
              placeholder="Ex: 8500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Commentaires réels</label>
            <input
              type="number"
              name="actualComments"
              defaultValue={existingStats?.actualComments || ''}
              placeholder="Ex: 650"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prix payé (€)</label>
            <input
              type="number"
              name="actualPrice"
              defaultValue={existingStats?.actualPrice || ''}
              step="0.01"
              placeholder="Ex: 1200"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          💡 <strong>Astuce:</strong> Le système calculera automatiquement les écarts par rapport aux
          prédictions, le CPV réel, et générera une recommandation pour une future collaboration.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : existingStats ? '💾 Mettre à jour les stats' : '💾 Enregistrer les stats'}
        </button>
      </form>
    </div>
  );
}
