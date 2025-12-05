type Project = {
  id: string;
  name: string;
  predictedViews: number | null;
  predictedLikes: number | null;
  predictedComments: number | null;
  predictedCPV: number | null;
  budgetAlloue: number | null;
};

type CollaborationStats = {
  actualViews: number | null;
  actualLikes: number | null;
  actualComments: number | null;
  actualCPV: number | null;
  actualPrice: number | null;
  viewsVariance: number | null;
  likesVariance: number | null;
  commentsVariance: number | null;
  cpvVariance: number | null;
  performanceRating: string | null;
  recommendRecollab: boolean | null;
};

export function ProjectPerformanceTracker({
  project,
  stats,
}: {
  project: Project;
  stats: CollaborationStats;
}) {
  const getRatingColor = (rating: string | null) => {
    switch (rating) {
      case 'EXCELLENT':
        return 'bg-green-500 text-white';
      case 'BON':
        return 'bg-blue-500 text-white';
      case 'MOYEN':
        return 'bg-yellow-500 text-white';
      case 'DECEVANT':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getVarianceColor = (variance: number | null) => {
    if (!variance) return 'text-gray-600';
    if (variance > 10) return 'text-green-600';
    if (variance > -10) return 'text-gray-600';
    return 'text-red-600';
  };

  const formatVariance = (variance: number | null) => {
    if (!variance) return 'N/A';
    const sign = variance > 0 ? '+' : '';
    return `${sign}${variance.toFixed(1)}%`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Tracker de Performance</h2>

      {/* Rating global */}
      <div className="mb-6">
        <div
          className={`inline-block px-6 py-3 rounded-xl text-2xl font-bold ${getRatingColor(
            stats.performanceRating
          )}`}
        >
          {stats.performanceRating || 'NON ÉVALUÉ'}
        </div>

        {stats.recommendRecollab !== null && (
          <div className="mt-2 text-sm">
            {stats.recommendRecollab ? (
              <span className="text-green-700 font-semibold">
                ✅ Recommandé pour une future collaboration
              </span>
            ) : (
              <span className="text-red-700 font-semibold">
                ⚠️ Non recommandé pour une future collaboration
              </span>
            )}
          </div>
        )}
      </div>

      {/* Comparaison prédit vs réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vues */}
        <div className="card-glass p-4">
          <div className="text-sm text-gray-600 mb-2">👁️ Vues</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm">Prédit:</span>
              <span className="font-semibold">{project.predictedViews?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Réel:</span>
              <span className="font-bold text-green-700">
                {stats.actualViews?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm">Écart:</span>
              <span className={`font-bold ${getVarianceColor(stats.viewsVariance)}`}>
                {formatVariance(stats.viewsVariance)}
              </span>
            </div>
          </div>
        </div>

        {/* CPV */}
        <div className="card-glass p-4">
          <div className="text-sm text-gray-600 mb-2">💰 CPV (Coût par vue)</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm">Prédit:</span>
              <span className="font-semibold">
                {project.predictedCPV ? `${project.predictedCPV.toFixed(3)}€` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Réel:</span>
              <span className="font-bold text-green-700">
                {stats.actualCPV ? `${stats.actualCPV.toFixed(3)}€` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm">Écart:</span>
              <span className={`font-bold ${getVarianceColor(stats.cpvVariance ? -stats.cpvVariance : null)}`}>
                {formatVariance(stats.cpvVariance)}
              </span>
            </div>
          </div>
        </div>

        {/* Likes */}
        <div className="card-glass p-4">
          <div className="text-sm text-gray-600 mb-2">❤️ Likes</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm">Prédit:</span>
              <span className="font-semibold">{project.predictedLikes?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Réel:</span>
              <span className="font-bold text-green-700">
                {stats.actualLikes?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm">Écart:</span>
              <span className={`font-bold ${getVarianceColor(stats.likesVariance)}`}>
                {formatVariance(stats.likesVariance)}
              </span>
            </div>
          </div>
        </div>

        {/* Commentaires */}
        <div className="card-glass p-4">
          <div className="text-sm text-gray-600 mb-2">💬 Commentaires</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm">Prédit:</span>
              <span className="font-semibold">
                {project.predictedComments?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Réel:</span>
              <span className="font-bold text-green-700">
                {stats.actualComments?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm">Écart:</span>
              <span className={`font-bold ${getVarianceColor(stats.commentsVariance)}`}>
                {formatVariance(stats.commentsVariance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="mt-6 card-glass p-4">
        <div className="text-sm text-gray-600 mb-2">💵 Budget</div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm">Alloué:</span>
            <span className="font-semibold">{project.budgetAlloue?.toLocaleString()}€</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Payé:</span>
            <span className="font-bold text-green-700">{stats.actualPrice?.toLocaleString()}€</span>
          </div>
        </div>
      </div>
    </div>
  );
}
