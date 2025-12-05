'use client';

import { updateProject } from '@/lib/actions/projects';
import { useState } from 'react';

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  budgetAlloue: number | null;
  platform: string | null;
  formatType: string | null;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  priority: string | null;
  tags: string | null;
  notes: string | null;
  nextActionDate: Date | null;
  reminderSet: boolean;
};

export function ProjectEditForm({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await updateProject({
      id: project.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      budgetAlloue: formData.get('budgetAlloue') ? parseFloat(formData.get('budgetAlloue') as string) : undefined,
      platform: formData.get('platform') as string,
      formatType: formData.get('formatType') as string,
      plannedStartDate: formData.get('plannedStartDate') ? new Date(formData.get('plannedStartDate') as string) : undefined,
      plannedEndDate: formData.get('plannedEndDate') ? new Date(formData.get('plannedEndDate') as string) : undefined,
      priority: formData.get('priority') as string,
      tags: formData.get('tags') as string,
      notes: formData.get('notes') as string,
      nextActionDate: formData.get('nextActionDate') ? new Date(formData.get('nextActionDate') as string) : undefined,
      reminderSet: formData.get('reminderSet') === 'on',
    });

    if (result.success) {
      setIsEditing(false);
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className="card-glass p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">📝 Détails du Projet</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du projet</label>
            <input
              type="text"
              name="name"
              defaultValue={project.name}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={project.description || ''}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Budget (€)</label>
              <input
                type="number"
                name="budgetAlloue"
                defaultValue={project.budgetAlloue || ''}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priorité</label>
              <select
                name="priority"
                defaultValue={project.priority || 'MEDIUM'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="HIGH">Haute</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="LOW">Basse</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Plateforme</label>
              <select
                name="platform"
                defaultValue={project.platform || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Sélectionner --</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="TIKTOK">TikTok</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Format</label>
              <select
                name="formatType"
                defaultValue={project.formatType || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Sélectionner --</option>
                <option value="REEL">Reel</option>
                <option value="STORY">Story</option>
                <option value="TIKTOK_VIDEO">Vidéo TikTok</option>
                <option value="YOUTUBE_VIDEO">Vidéo YouTube</option>
                <option value="POST">Post</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date début prévue</label>
              <input
                type="date"
                name="plannedStartDate"
                defaultValue={formatDateForInput(project.plannedStartDate)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date fin prévue</label>
              <input
                type="date"
                name="plannedEndDate"
                defaultValue={formatDateForInput(project.plannedEndDate)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (séparés par virgules)</label>
            <input
              type="text"
              name="tags"
              defaultValue={project.tags || ''}
              placeholder="noel, decoration, premium"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              defaultValue={project.notes || ''}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prochaine action</label>
              <input
                type="date"
                name="nextActionDate"
                defaultValue={formatDateForInput(project.nextActionDate)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="reminderSet"
                  defaultChecked={project.reminderSet}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-gray-700">Activer rappel</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            💾 Enregistrer les modifications
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Budget</div>
              <div className="font-semibold text-green-700">
                {project.budgetAlloue ? `${project.budgetAlloue.toLocaleString()}€` : 'Non défini'}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Priorité</div>
              <div className="font-semibold">{project.priority || 'Non défini'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Plateforme</div>
              <div className="font-semibold">{project.platform || 'Non défini'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Format</div>
              <div className="font-semibold">{project.formatType || 'Non défini'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Date début</div>
              <div className="font-semibold">
                {project.plannedStartDate ? new Date(project.plannedStartDate).toLocaleDateString('fr-FR') : 'Non défini'}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Date fin</div>
              <div className="font-semibold">
                {project.plannedEndDate ? new Date(project.plannedEndDate).toLocaleDateString('fr-FR') : 'Non défini'}
              </div>
            </div>
          </div>

          {project.tags && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Tags</div>
              <div className="flex gap-2 flex-wrap">
                {project.tags.split(',').map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.notes && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Notes</div>
              <div className="text-gray-800">{project.notes}</div>
            </div>
          )}

          {project.nextActionDate && (
            <div>
              <div className="text-sm text-gray-600">Prochaine action</div>
              <div className="font-semibold text-orange-700">
                {new Date(project.nextActionDate).toLocaleDateString('fr-FR')}
                {project.reminderSet && ' (Rappel activé ⏰)'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
