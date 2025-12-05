'use client';

type OrganicBreakdown = {
  platform: string;
  formatType: string;
  price: number;
  avgViews: number;
  cpv: number;
  roiScore: number;
};

type Props = {
  breakdown: OrganicBreakdown[];
};

const PLATFORM_EMOJI: Record<string, string> = {
  INSTAGRAM: '📸',
  TIKTOK: '🎵',
  YOUTUBE: '▶️',
};

const FORMAT_LABELS: Record<string, string> = {
  REEL: 'Reel',
  STORY: 'Story',
  STORY_SET: 'Story Set',
  POST_FEED: 'Post Feed',
  POST_CARROUSEL: 'Carrousel',
  TIKTOK_VIDEO: 'Video',
  TIKTOK_SERIE: 'Série',
  YOUTUBE_VIDEO: 'Video',
  YOUTUBE_SHORT: 'Short',
  YOUTUBE_INTEGRATION: 'Intégration',
  OTHER: 'Autre',
};

function getRoiColor(roiScore: number): string {
  if (roiScore >= 80) return 'text-green-600 font-bold';
  if (roiScore >= 60) return 'text-green-500';
  if (roiScore >= 40) return 'text-orange-500';
  if (roiScore >= 20) return 'text-orange-600';
  return 'text-red-600';
}

function getRoiLabel(roiScore: number): string {
  if (roiScore >= 80) return '🔥 Excellent';
  if (roiScore >= 60) return '✅ Bon';
  if (roiScore >= 40) return '⚠️ Moyen';
  if (roiScore >= 20) return '❌ Faible';
  return '🚫 Mauvais';
}

export default function OrganicBreakdownTable({ breakdown }: Props) {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-sm">
          Aucune donnée de potentiel organique disponible. Définissez les tarifs et ajoutez des stats organiques par format.
        </p>
      </div>
    );
  }

  // Trier par ROI score décroissant
  const sorted = [...breakdown].sort((a, b) => b.roiScore - a.roiScore);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plateforme
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Format
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vues moy.
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              CPV
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score ROI
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Verdict
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sorted.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className="mr-1">{PLATFORM_EMOJI[item.platform] || '📱'}</span>
                {item.platform}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                {FORMAT_LABELS[item.formatType] || item.formatType}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold">
                {item.price.toFixed(0)}€
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                {item.avgViews.toLocaleString('fr-FR')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">
                {item.cpv.toFixed(4)}€
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-bold ${getRoiColor(item.roiScore)}`}>
                {item.roiScore.toFixed(0)}/100
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {getRoiLabel(item.roiScore)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Conseil :</strong> Privilégiez les formats avec les meilleurs scores ROI (vert). 
          Un CPV bas = plus de visibilité pour moins cher.
        </p>
      </div>
    </div>
  );
}
