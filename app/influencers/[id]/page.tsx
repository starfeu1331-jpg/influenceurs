import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { updateInfluencerFit } from '@/lib/actions/influencers';
import { addStatsSnapshot, deleteStatsSnapshot } from '@/lib/actions/stats';
import { addCollaborationStats, deleteCollaborationStats } from '@/lib/actions/collabs';
import { recalculateScore } from '@/lib/actions/scores';
import { EditPlatformsForm } from '@/components/influencers/edit-platforms-form';
import Link from 'next/link';

const platformLabels: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
  OTHER: 'Autre',
};

export default async function InfluencerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const influencer = await prisma.influencer.findUnique({
    where: { id: params.id },
    include: {
      platforms: true, // NOUVEAU: charger les plateformes
      statsSnapshots: {
        orderBy: { createdAt: 'desc' },
      },
      collaborationStats: {
        orderBy: { createdAt: 'desc' },
      },
      projects: {
        orderBy: { createdAt: 'desc' },
        include: {
          projectCollaborationStats: true,
        },
      },
      scores: {
        orderBy: { computedAt: 'desc' },
        take: 10, // Prendre plus de scores pour voir par plateforme
      },
    },
  });

  if (!influencer) {
    notFound();
  }

  const latestGlobalScore = influencer.scores.find(s => !s.platform);
  const totalFollowers = influencer.platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
  const platformIcons: Record<string, string> = {
    INSTAGRAM: '📸',
    TIKTOK: '🎵',
    YOUTUBE: '▶️',
    OTHER: '🌐',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-glass p-6">
        <Link href="/influencers" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Retour à la liste
        </Link>
        <h1 className="text-3xl font-bold mb-4">{influencer.name}</h1>
          
          {/* Plateformes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Plateformes</h3>
              <EditPlatformsForm 
                influencerId={influencer.id} 
                initialPlatforms={influencer.platforms}
              />
            </div>
            {influencer.platforms.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucune plateforme configurée</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {influencer.platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="border rounded-lg p-3 bg-gradient-to-br from-gray-50 to-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{platformIcons[platform.platform]}</span>
                        <span className="font-semibold text-gray-900">
                          {platformLabels[platform.platform]}
                        </span>
                      </div>
                      {platform.isMain && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                          Principale
                        </span>
                      )}
                    </div>
                    {platform.username && (
                      <div className="text-sm text-gray-600">@{platform.username}</div>
                    )}
                    {platform.followers && (
                      <div className="text-sm font-semibold text-blue-600 mt-1">
                        {platform.followers.toLocaleString('fr-FR')} abonnés
                      </div>
                    )}
                    {platform.profileUrl && (
                      <a
                        href={platform.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline mt-1 block"
                      >
                        Voir le profil →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm border-t pt-4">
            <div>
              <span className="text-gray-500">Total Abonnés</span>
              <div className="font-bold text-lg text-gray-900">
                {totalFollowers.toLocaleString('fr-FR')}
              </div>
            </div>
            {influencer.location && (
              <div>
                <span className="text-gray-500">Localisation</span>
                <div className="font-medium">{influencer.location}</div>
              </div>
            )}
            {latestGlobalScore && (
              <div>
                <span className="text-gray-500">Score Global</span>
                <div className="font-bold text-lg text-green-600">
                  {latestGlobalScore.totalScore.toFixed(0)}/100
                </div>
              </div>
            )}
          </div>
          {influencer.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-500">Notes : </span>
              <span className="text-sm">{influencer.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Fit & cible */}
      <div className="card-glass p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Fit & Cible</h2>
        <form action={updateInfluencerFit.bind(null, influencer.id)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="topicsNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Sujets / Thématiques
              </label>
              <textarea
                id="topicsNotes"
                name="topicsNotes"
                rows={3}
                defaultValue={influencer.topicsNotes || ''}
                placeholder="ex: rénovation, déco, DIY..."
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="audienceNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Audience / Géographie
              </label>
              <textarea
                id="audienceNotes"
                name="audienceNotes"
                rows={3}
                defaultValue={influencer.audienceNotes || ''}
                placeholder="ex: majorité France, beaucoup Sud..."
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="projectTimeline" className="block text-sm font-medium text-gray-700 mb-1">
                Temporalité / Projets en cours
              </label>
              <input
                type="text"
                id="projectTimeline"
                name="projectTimeline"
                defaultValue={influencer.projectTimeline || ''}
                placeholder="ex: Rénovation maison 2025-2026"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="fitThemeScore" className="block text-sm font-medium text-gray-700 mb-1">
                Score thématique (0-100)
              </label>
              <input
                type="number"
                id="fitThemeScore"
                name="fitThemeScore"
                min="0"
                max="100"
                defaultValue={influencer.fitThemeScore || ''}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="fitGeoScore" className="block text-sm font-medium text-gray-700 mb-1">
                Score géographique (0-100)
              </label>
              <input
                type="number"
                id="fitGeoScore"
                name="fitGeoScore"
                min="0"
                max="100"
                defaultValue={influencer.fitGeoScore || ''}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="fitTimingScore" className="block text-sm font-medium text-gray-700 mb-1">
                Score temporel (0-100)
              </label>
              <input
                type="number"
                id="fitTimingScore"
                name="fitTimingScore"
                min="0"
                max="100"
                defaultValue={influencer.fitTimingScore || ''}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Enregistrer fit / cible
          </button>
        </form>
      </div>

      {/* Stats organiques */}
      <div className="card-glass p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Stats organiques</h2>
        
        <form action={addStatsSnapshot.bind(null, influencer.id)} className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-3">Ajouter un snapshot</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                Plateforme
              </label>
              <select
                id="platform"
                name="platform"
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="INSTAGRAM">Instagram</option>
                <option value="TIKTOK">TikTok</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="OTHER">Autre</option>
              </select>
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
            <div>
              <label htmlFor="avgViews" className="block text-sm font-medium text-gray-700 mb-1">
                Vues moy.
              </label>
              <input
                type="number"
                id="avgViews"
                name="avgViews"
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="avgLikes" className="block text-sm font-medium text-gray-700 mb-1">
                Likes moy.
              </label>
              <input
                type="number"
                id="avgLikes"
                name="avgLikes"
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="avgComments" className="block text-sm font-medium text-gray-700 mb-1">
                Coms moy.
              </label>
              <input
                type="number"
                id="avgComments"
                name="avgComments"
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            + Ajouter
          </button>
        </form>

        {influencer.statsSnapshots.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune stat organique ajoutée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Plateforme</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Période</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Vues moy.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Likes moy.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Coms moy.</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {influencer.statsSnapshots.map((snapshot) => (
                  <tr key={snapshot.id}>
                    <td className="px-4 py-2 text-sm">{platformLabels[snapshot.platform]}</td>
                    <td className="px-4 py-2 text-sm">
                      {snapshot.period === 'LAST_15_DAYS' && '15j'}
                      {snapshot.period === 'LAST_30_DAYS' && '30j'}
                      {snapshot.period === 'LAST_3_MONTHS' && '3 mois'}
                    </td>
                    <td className="px-4 py-2 text-sm">{snapshot.avgViews?.toLocaleString('fr-FR') || '-'}</td>
                    <td className="px-4 py-2 text-sm">{snapshot.avgLikes?.toLocaleString('fr-FR') || '-'}</td>
                    <td className="px-4 py-2 text-sm">{snapshot.avgComments?.toLocaleString('fr-FR') || '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      <form action={deleteStatsSnapshot.bind(null, snapshot.id, influencer.id)}>
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats collabs (historique pour scoring) */}
      <div className="card-glass p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">📊 Collaborations historiques</h2>
        <p className="text-sm text-gray-600 mb-4">Ces stats sont utilisées pour calculer le score de l'influenceur</p>
        
        <form action={addCollaborationStats.bind(null, influencer.id)} className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-3">Ajouter une collaboration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="collabTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                id="collabTitle"
                name="title"
                placeholder="ex: Collab marque X"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="collabDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="collabDate"
                name="date"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="collabPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                Plateforme
              </label>
              <select
                id="collabPlatform"
                name="platform"
                required
                className="w-full border rounded px-3 py-2"
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
                <option value="REEL">Reel</option>
                <option value="STORY">Story</option>
                <option value="TIKTOK_VIDEO">Vidéo TikTok</option>
                <option value="YOUTUBE_INTEGRATION">YouTube Intégration</option>
                <option value="YOUTUBE_DEDICATED">YouTube Dédié</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label htmlFor="collabViews" className="block text-sm font-medium text-gray-700 mb-1">
                Vues
              </label>
              <input
                type="number"
                id="collabViews"
                name="views"
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="collabLikes" className="block text-sm font-medium text-gray-700 mb-1">
                Likes
              </label>
              <input
                type="number"
                id="collabLikes"
                name="likes"
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="collabComments" className="block text-sm font-medium text-gray-700 mb-1">
                Commentaires
              </label>
              <input
                type="number"
                id="collabComments"
                name="comments"
                min="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="collabPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <input
                type="number"
                id="collabPrice"
                name="price"
                min="0"
                step="0.01"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isCollab"
                defaultChecked
                className="mr-2"
              />
              <span className="text-sm">C'est une collaboration</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            + Ajouter
          </button>
        </form>

        {influencer.collaborationStats.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune collaboration ajoutée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Titre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Format</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Vues</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Likes</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Coms</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Prix</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {influencer.collaborationStats.map((collab) => (
                  <tr key={collab.id}>
                    <td className="px-4 py-2 text-sm">{collab.title || '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      {collab.date ? new Date(collab.date).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-4 py-2 text-sm">{collab.formatType}</td>
                    <td className="px-4 py-2 text-sm">{collab.views?.toLocaleString('fr-FR') || '-'}</td>
                    <td className="px-4 py-2 text-sm">{collab.likes?.toLocaleString('fr-FR') || '-'}</td>
                    <td className="px-4 py-2 text-sm">{collab.comments?.toLocaleString('fr-FR') || '-'}</td>
                    <td className="px-4 py-2 text-sm">{collab.price ? `${collab.price.toFixed(2)} €` : '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      <form action={deleteCollaborationStats.bind(null, collab.id, influencer.id)}>
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Projets CRM */}
      <div className="card-glass p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🎯 Projets</h2>
          <Link
            href="/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            + Nouveau projet
          </Link>
        </div>

        {influencer.projects.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun projet créé avec cet influenceur.</p>
        ) : (
          <div className="space-y-3">
            {influencer.projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <span className={
                    `px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'TERMINE' ? 'bg-green-100 text-green-800' :
                      project.status === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'ACCORD' ? 'bg-purple-100 text-purple-800' :
                      project.status === 'REFUSE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`
                  }>
                    {project.status === 'PROSPECTION' && '🔍 Prospection'}
                    {project.status === 'PREMIER_CONTACT' && '👋 Premier Contact'}
                    {project.status === 'NEGOCIATION' && '💬 Négociation'}
                    {project.status === 'PROPOSITION' && '📤 Proposition'}
                    {project.status === 'ACCORD' && '🤝 Accord'}
                    {project.status === 'EN_COURS' && '🔄 En Cours'}
                    {project.status === 'TERMINE' && '✅ Terminé'}
                    {project.status === 'REFUSE' && '❌ Refusé'}
                    {project.status === 'A_RECONTACTER' && '🔔 À Recontacter'}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                )}
                <div className="flex gap-4 text-xs text-gray-500">
                  {project.budgetAlloue && (
                    <span>💰 {project.budgetAlloue.toLocaleString('fr-FR')} €</span>
                  )}
                  {project.platform && (
                    <span>📱 {project.platform}</span>
                  )}
                  {project.plannedStartDate && (
                    <span>📅 {new Date(project.plannedStartDate).toLocaleDateString('fr-FR')}</span>
                  )}
                  {project.collaborationStats && (
                    <span className="text-green-600 font-medium">✓ Stats disponibles</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Score actuel */}
      <div className="card-glass p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Score actuel</h2>
          <form action={recalculateScore.bind(null, influencer.id)}>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              🔄 Recalculer le score
            </button>
          </form>
        </div>

        {!latestGlobalScore ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Pas encore de score calculé.</p>
            <p className="text-sm">Ajoutez des données puis cliquez sur "Recalculer le score".</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 text-blue-800">
                <span className="text-4xl font-bold">{latestGlobalScore.totalScore.toFixed(1)}</span>
              </div>
              <p className="text-gray-500 mt-2">/ 100</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestGlobalScore.weightImpactCollabs > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Impact collabs</span>
                    <span className="text-xs text-gray-500">Poids: {latestGlobalScore.weightImpactCollabs.toFixed(1)}%</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {latestGlobalScore.impactCollabsScore.toFixed(1)} / 100
                  </div>
                </div>
              )}

              {latestGlobalScore.weightOrganicPotential > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Potentiel organique</span>
                    <span className="text-xs text-gray-500">Poids: {latestGlobalScore.weightOrganicPotential.toFixed(1)}%</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {latestGlobalScore.organicPotentialScore.toFixed(1)} / 100
                  </div>
                </div>
              )}

              {latestGlobalScore.weightProfitability > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Rentabilité</span>
                    <span className="text-xs text-gray-500">Poids: {latestGlobalScore.weightProfitability.toFixed(1)}%</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">
                    {latestGlobalScore.profitabilityScore.toFixed(1)} / 100
                  </div>
                </div>
              )}

              {latestGlobalScore.weightStrategicFit > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Fit stratégique</span>
                    <span className="text-xs text-gray-500">Poids: {latestGlobalScore.weightStrategicFit.toFixed(1)}%</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {latestGlobalScore.strategicFitScore.toFixed(1)} / 100
                  </div>
                </div>
              )}
            </div>

            {/* ROI Prévisionnel */}
            {latestGlobalScore.roiScore && (
              <div className="mt-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <h3 className="font-bold text-lg mb-3 text-indigo-900">📊 Estimation ROI</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Vues estimées</span>
                    <div className="text-xl font-bold text-indigo-700">
                      {latestGlobalScore.estimatedViews?.toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">CPV estimé</span>
                    <div className="text-xl font-bold text-indigo-700">
                      {latestGlobalScore.estimatedCPV?.toFixed(5)} €
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Score ROI</span>
                    <div className={`text-xl font-bold ${
                      latestGlobalScore.roiScore >= 75 ? 'text-green-600' :
                      latestGlobalScore.roiScore >= 60 ? 'text-yellow-600' :
                      latestGlobalScore.roiScore >= 40 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {latestGlobalScore.roiScore} / 100
                    </div>
                    <div className="text-xs mt-1">
                      {latestGlobalScore.roiScore >= 75 && <span className="text-green-600">✓ Excellent deal</span>}
                      {latestGlobalScore.roiScore >= 60 && latestGlobalScore.roiScore < 75 && <span className="text-yellow-600">○ Acceptable</span>}
                      {latestGlobalScore.roiScore >= 40 && latestGlobalScore.roiScore < 60 && <span className="text-orange-600">⚠ Cher</span>}
                      {latestGlobalScore.roiScore < 40 && <span className="text-red-600">✗ Trop cher</span>}
                    </div>
                  </div>
                </div>
                {influencer.projects.length > 0 && (
                  <p className="text-xs text-gray-500 mt-3">
                    Budget total projets : {influencer.projects.reduce((sum, p) => sum + (p.budgetAlloue || 0), 0).toLocaleString('fr-FR')} €
                  </p>
                )}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4 text-center">
              Calculé le {new Date(latestGlobalScore.computedAt).toLocaleString('fr-FR')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
