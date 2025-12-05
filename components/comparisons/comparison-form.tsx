'use client';

import { useState } from 'react';
import { analyzeAndRecommend, createComparison } from '@/lib/actions/comparisons';

type Influencer = {
  id: string;
  name: string;
  location: string | null;
  platforms: Array<{
    id: string;
    platform: string;
    followers: number | null;
    username: string | null;
    isMain: boolean;
  }>;
  fitThemeScore: number | null;
  scores: Array<{
    totalScore: number;
    impactCollabsScore: number;
    organicPotentialScore: number;
    profitabilityScore: number;
    strategicFitScore: number;
  }>;
};

export function ComparisonForm({ influencers }: { influencers: Influencer[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      alert('Sélectionnez au moins 2 influenceurs');
      return;
    }

    setComparing(true);

    // Obtenir les données complètes
    const selectedInfluencers = influencers.filter((inf) => selectedIds.includes(inf.id));
    setComparisonData(selectedInfluencers);

    // Obtenir recommandations
    const result = await analyzeAndRecommend(selectedIds);
    if (result.success) {
      setRecommendations(result.recommendations);
    }

    setComparing(false);
  };

  const selectedInfluencers = influencers.filter((inf) => selectedIds.includes(inf.id));

  return (
    <div className="space-y-8">
      {/* Sélection */}
      <div className="card-glass p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          1️⃣ Sélectionnez 2 à 5 influenceurs
        </h2>
        <div className="mb-4 text-sm text-gray-600">
          {selectedIds.length}/5 sélectionnés
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
          {influencers.map((influencer) => {
            const isSelected = selectedIds.includes(influencer.id);
            const latestScore = influencer.scores[0];
            const totalFollowers = influencer.platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
            const mainPlatform = influencer.platforms.find(p => p.isMain) || influencer.platforms[0];

            return (
              <div
                key={influencer.id}
                onClick={() => toggleSelection(influencer.id)}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-teal-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-gray-900">{influencer.name}</div>
                  {isSelected && <div className="text-2xl">✓</div>}
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {influencer.platforms.map((p) => (
                      <span key={p.id} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {p.platform} {p.isMain && '⭐'}
                      </span>
                    ))}
                  </div>
                  {totalFollowers > 0 && (
                    <div>👥 {totalFollowers.toLocaleString()} abonnés</div>
                  )}
                  {latestScore && (
                    <div className="font-semibold text-teal-700">
                      Score: {latestScore.totalScore.toFixed(0)}/100
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleCompare}
          disabled={selectedIds.length < 2 || comparing}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
        >
          {comparing ? 'Analyse en cours...' : `🔍 Comparer (${selectedIds.length})`}
        </button>
      </div>

      {/* Recommandations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">🏆 Recommandations</h2>

          <div className="space-y-3">
            {recommendations.map((rec: any, idx: number) => (
              <div
                key={rec.influencerId}
                className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 ${
                  idx === 0 ? 'ring-2 ring-yellow-300' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''}  {rec.influencerName}
                  </div>
                  <div className="text-2xl font-bold">{rec.score}/100</div>
                </div>

                {rec.reasons.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {rec.reasons.map((reason: string, ridx: number) => (
                      <div key={ridx} className="text-sm flex items-start gap-2">
                        <span>✅</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}

                {rec.warnings.length > 0 && (
                  <div className="space-y-1">
                    {rec.warnings.map((warning: string, widx: number) => (
                      <div key={widx} className="text-sm flex items-start gap-2 opacity-90">
                        <span>⚠️</span>
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tableau comparatif */}
      {comparisonData && comparisonData.length > 0 && (
        <div className="card-glass p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Comparaison Détaillée</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-3 font-bold text-gray-700">Critère</th>
                {comparisonData.map((inf: Influencer) => (
                  <th key={inf.id} className="text-center p-3 font-bold text-gray-900">
                    {inf.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="p-3 font-semibold">Plateforme</td>
                {comparisonData.map((inf: Influencer) => (
                  <td key={inf.id} className="text-center p-3">
                    {inf.platforms.find(p => p.isMain)?.platform || inf.platforms[0]?.platform || 'N/A'}
                  </td>
                ))}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Abonnés</td>
                {comparisonData.map((inf: Influencer) => {
                  const totalFollowers = inf.platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
                  return (
                    <td key={inf.id} className="text-center p-3">
                      {totalFollowers > 0 ? totalFollowers.toLocaleString() : 'N/A'}
                    </td>
                  );
                })}
              </tr>

              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="p-3 font-semibold">Localisation</td>
                {comparisonData.map((inf: Influencer) => (
                  <td key={inf.id} className="text-center p-3 text-sm">
                    {inf.location || 'N/A'}
                  </td>
                ))}
              </tr>

              <tr className="border-b-2 border-teal-300 bg-teal-50">
                <td className="p-3 font-bold text-teal-900">Score Total</td>
                {comparisonData.map((inf: Influencer) => {
                  const score = inf.scores[0];
                  return (
                    <td key={inf.id} className="text-center p-3 font-bold text-2xl text-teal-700">
                      {score ? score.totalScore.toFixed(0) : 'N/A'}
                    </td>
                  );
                })}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Impact Collabs</td>
                {comparisonData.map((inf: Influencer) => {
                  const score = inf.scores[0];
                  return (
                    <td key={inf.id} className="text-center p-3">
                      {score ? score.impactCollabsScore.toFixed(0) : 'N/A'}
                    </td>
                  );
                })}
              </tr>

              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="p-3 font-semibold">Potentiel Organique</td>
                {comparisonData.map((inf: Influencer) => {
                  const score = inf.scores[0];
                  return (
                    <td key={inf.id} className="text-center p-3">
                      {score ? score.organicPotentialScore.toFixed(0) : 'N/A'}
                    </td>
                  );
                })}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Rentabilité</td>
                {comparisonData.map((inf: Influencer) => {
                  const score = inf.scores[0];
                  return (
                    <td key={inf.id} className="text-center p-3">
                      {score ? score.profitabilityScore.toFixed(0) : 'N/A'}
                    </td>
                  );
                })}
              </tr>

              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="p-3 font-semibold">Fit Stratégique</td>
                {comparisonData.map((inf: Influencer) => {
                  const score = inf.scores[0];
                  return (
                    <td key={inf.id} className="text-center p-3">
                      {score ? score.strategicFitScore.toFixed(0) : 'N/A'}
                    </td>
                  );
                })}
              </tr>

              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Fit Thématique</td>
                {comparisonData.map((inf: Influencer) => (
                  <td key={inf.id} className="text-center p-3">
                    {inf.fitThemeScore || 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
