'use client';

import { ComputedScore } from '@/lib/scoring/computeInfluencerScore';
import { BASE_PRICES } from '@/lib/pricing/pricing';

interface ScoreBreakdownProps {
  score: ComputedScore;
}

export function ScoreBreakdown({ score }: ScoreBreakdownProps) {
  const formatDisplayName: Record<string, string> = {
    REEL: 'Reel Instagram',
    STORY: 'Story Instagram',
    STORY_SET: 'Set de Stories',
    POST_FEED: 'Post Feed',
    POST_CARROUSEL: 'Carrousel',
    TIKTOK_VIDEO: 'Vidéo TikTok',
    TIKTOK_SERIE: 'Série TikTok',
    YOUTUBE_VIDEO: 'Vidéo YouTube',
    YOUTUBE_SHORT: 'Short YouTube',
    YOUTUBE_INTEGRATION: 'Intégration YouTube',
    OTHER: 'Autre',
  };

  const getRatingColor = (roiScore: number) => {
    if (roiScore >= 75) return 'text-green-600';
    if (roiScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingLabel = (roiScore: number) => {
    if (roiScore >= 75) return 'Excellent';
    if (roiScore >= 50) return 'Bon';
    if (roiScore >= 25) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="space-y-6">
      {/* Score global */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="text-sm font-medium opacity-90 mb-2">Score Global</div>
        <div className="text-5xl font-bold mb-4">{score.totalScore.toFixed(1)}/100</div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="opacity-75">Impact Collabs</div>
            <div className="font-semibold">{score.impactCollabsScore.toFixed(1)} ({score.weightImpactCollabs.toFixed(0)}%)</div>
          </div>
          <div>
            <div className="opacity-75">Potentiel Organique</div>
            <div className="font-semibold">{score.organicPotentialScore.toFixed(1)} ({score.weightOrganicPotential.toFixed(0)}%)</div>
          </div>
          <div>
            <div className="opacity-75">Rentabilité</div>
            <div className="font-semibold">{score.profitabilityScore.toFixed(1)} ({score.weightProfitability.toFixed(0)}%)</div>
          </div>
          <div>
            <div className="opacity-75">Fit Stratégique</div>
            <div className="font-semibold">{score.strategicFitScore.toFixed(1)} ({score.weightStrategicFit.toFixed(0)}%)</div>
          </div>
        </div>
      </div>

      {/* Détail par format */}
      {score.formatBreakdown && score.formatBreakdown.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Performance par Format</h3>
          
          <div className="space-y-4">
            {score.formatBreakdown.map((format) => (
              <div key={format.format} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {format.format.includes('REEL') ? '📸' :
                       format.format.includes('STORY') ? '📱' :
                       format.format.includes('TIKTOK') ? '🎵' :
                       format.format.includes('YOUTUBE') ? '📹' : '📄'}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {formatDisplayName[format.format] || format.format}
                      </div>
                      <div className="text-xs text-gray-500">{format.count} collaboration{format.count > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  
                  <div className={`text-right ${getRatingColor(format.roiScore)}`}>
                    <div className="text-2xl font-bold">{format.roiScore.toFixed(0)}/100</div>
                    <div className="text-xs font-medium">{getRatingLabel(format.roiScore)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500 mb-1">Prix moyen</div>
                    <div className="font-semibold text-gray-800">{format.avgPrice.toFixed(0)}€</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500 mb-1">Vues moyennes</div>
                    <div className="font-semibold text-gray-800">
                      {format.avgViews >= 1000 
                        ? `${(format.avgViews / 1000).toFixed(1)}k` 
                        : format.avgViews.toFixed(0)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500 mb-1">CPM</div>
                    <div className="font-semibold text-gray-800">
                      {format.cpm.toFixed(2)}€
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-gray-500 mb-1">CPE</div>
                    <div className="font-semibold text-gray-800">
                      {format.cpe.toFixed(2)}€
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tarifs de référence */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-sm font-semibold mb-3 text-blue-900">💡 Tarifs de Référence</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {Object.entries(BASE_PRICES).map(([format, price]) => (
            <div key={format} className="flex justify-between items-center bg-white rounded px-3 py-2">
              <span className="text-gray-600">{formatDisplayName[format] || format}</span>
              <span className="font-semibold text-blue-900">{price}€</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-blue-700 mt-3 italic">
          * Ces tarifs sont multipliés selon le nombre de followers (0.5x à 3x)
        </p>
      </div>
    </div>
  );
}
