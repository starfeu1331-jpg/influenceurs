'use client';

import { createProject } from '@/lib/actions/projects';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Influencer = {
  id: string;
  name: string;
  platforms: {
    platform: string;
    isMain: boolean;
  }[];
};

export function CreateProjectForm({ influencers }: { influencers: Influencer[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await createProject({
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      influencerId: formData.get('influencerId') as string,
      status: formData.get('status') as string,
      proposedBy: formData.get('proposedBy') as string || undefined,
      proposedDate: formData.get('proposedDate')
        ? new Date(formData.get('proposedDate') as string)
        : undefined,
      plannedStartDate: formData.get('plannedStartDate')
        ? new Date(formData.get('plannedStartDate') as string)
        : undefined,
      plannedEndDate: formData.get('plannedEndDate')
        ? new Date(formData.get('plannedEndDate') as string)
        : undefined,
      budgetAlloue: formData.get('budgetAlloue')
        ? parseFloat(formData.get('budgetAlloue') as string)
        : undefined,
      platform: formData.get('platform') as string || undefined,
      formatType: formData.get('formatType') as string || undefined,
      predictedViews: formData.get('predictedViews')
        ? parseInt(formData.get('predictedViews') as string)
        : undefined,
      predictedLikes: formData.get('predictedLikes')
        ? parseInt(formData.get('predictedLikes') as string)
        : undefined,
      predictedComments: formData.get('predictedComments')
        ? parseInt(formData.get('predictedComments') as string)
        : undefined,
      predictedCPV: formData.get('predictedCPV')
        ? parseFloat(formData.get('predictedCPV') as string)
        : undefined,
      priority: formData.get('priority') as string,
      tags: formData.get('tags') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    });

    setLoading(false);

    if (result.success && result.project) {
      router.push(`/projects/${result.project.id}`);
    } else if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <div className="card-glass p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du projet *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Ex: Collab Noël 2025 - Siham"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Influenceur *</label>
          <select
            name="influencerId"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Sélectionner un influenceur --</option>
            {influencers.map((inf) => {
              const mainPlatform = inf.platforms.find(p => p.isMain)?.platform || inf.platforms[0]?.platform || 'N/A';
              return (
                <option key={inf.id} value={inf.id}>
                  {inf.name} ({mainPlatform})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Décrivez le projet..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Statut initial</label>
            <select
              name="status"
              defaultValue="PROPOSE"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="PROPOSE">💡 Proposé</option>
              <option value="PROSPECTION">🔍 Prospection</option>
              <option value="PREMIER_CONTACT">👋 Premier Contact</option>
              <option value="NEGOCIATION">💬 Négociation</option>
              <option value="PROPOSITION">📤 Proposition</option>
              <option value="ACCORD">🤝 Accord</option>
              <option value="EN_COURS">🔄 En Cours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Priorité</label>
            <select
              name="priority"
              defaultValue="MEDIUM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="HIGH">Haute</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="LOW">Basse</option>
            </select>
          </div>
        </div>

        {/* NOUVEAU: Origine de la proposition */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">💡 Origine de la proposition</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Proposé par</label>
              <input
                type="text"
                name="proposedBy"
                placeholder="Ex: Charline - Agent Pierre & Phill"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Nom de l'agent, directeur magasin, etc.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date de proposition</label>
              <input
                type="date"
                name="proposedDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Budget (€)</label>
            <input
              type="number"
              name="budgetAlloue"
              step="0.01"
              placeholder="Ex: 1200"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Plateforme</label>
            <select
              name="platform"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Sélectionner --</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="TIKTOK">TikTok</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Format 📊</label>
            <select
              name="formatType"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <p className="text-xs text-gray-500 mt-1">💡 Tarifs de base</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              name="tags"
              placeholder="noel, decoration, premium"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date début prévue</label>
            <input
              type="date"
              name="plannedStartDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date fin prévue</label>
            <input
              type="date"
              name="plannedEndDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            rows={2}
            placeholder="Notes internes..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Prédictions (optionnel)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vues prédites</label>
              <input
                type="number"
                name="predictedViews"
                placeholder="Ex: 80000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Likes prédits</label>
              <input
                type="number"
                name="predictedLikes"
                placeholder="Ex: 8000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Commentaires prédits</label>
              <input
                type="number"
                name="predictedComments"
                placeholder="Ex: 600"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CPV prédit (€)</label>
              <input
                type="number"
                name="predictedCPV"
                step="0.001"
                placeholder="Ex: 0.015"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Création...' : '✨ Créer le projet'}
        </button>
      </form>
    </div>
  );
}
