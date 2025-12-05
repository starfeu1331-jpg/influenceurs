import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ComparisonForm } from '@/components/comparisons/comparison-form';

export default async function ComparePage() {
  // Récupérer tous les influenceurs avec leurs scores et plateformes
  const influencers = await prisma.influencer.findMany({
    include: {
      platforms: true, // Toutes les plateformes
      scores: {
        orderBy: { computedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="card-glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                ⚖️ Comparateur d'Influenceurs
              </h1>
              <p className="text-gray-600 mt-2">
                Comparez jusqu'à 5 influenceurs côte à côte et obtenez des recommandations
              </p>
            </div>

            <Link
              href="/influencers"
              className="px-4 py-2 bg-white/50 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/80 transition-all shadow-sm"
            >
              ← Retour
            </Link>
          </div>
        </div>

        {/* Formulaire de comparaison */}
        <ComparisonForm influencers={influencers} />
      </div>
    </div>
  );
}
