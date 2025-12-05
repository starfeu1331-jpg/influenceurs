import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FilterBar } from '@/components/FilterBar';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  SparklesIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { PlatformIcon } from '@/components/influencers/platform-icon';
import { FloatingSearchButton } from '@/components/influencers/search-button';

type SortBy = 'score' | 'followers' | 'name';

const platformLabels: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
  OTHER: 'Autre',
};

const platformColors: Record<string, string> = {
  INSTAGRAM: 'from-pink-500 to-purple-500',
  TIKTOK: 'from-gray-900 to-teal-500',
  YOUTUBE: 'from-red-500 to-red-600',
  OTHER: 'from-apple-blue-500 to-apple-purple-500',
};

export default async function InfluencersPage(props: {
  searchParams: Promise<{ sort?: SortBy; platform?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const sortBy = searchParams.sort || 'score';
  const platformFilter = searchParams.platform;
  const searchTerm = searchParams.search;
  // Charger les influenceurs avec leur dernier score ET leurs plateformes
  let influencers = await prisma.influencer.findMany({
    where: {
      AND: [
        platformFilter ? {
          platforms: {
            some: { platform: platformFilter }
          }
        } : {},
        searchTerm ? {
          OR: [
            { name: { contains: searchTerm } },
            { location: { contains: searchTerm } },
            { notes: { contains: searchTerm } },
            { topicsNotes: { contains: searchTerm } },
            { audienceNotes: { contains: searchTerm } },
          ]
        } : {},
      ]
    },
    include: {
      platforms: true, // Toutes les plateformes
      scores: {
        orderBy: { computedAt: 'desc' },
        take: 1,
      },
    },
  });

  // Tri
  if (sortBy === 'score') {
    influencers.sort((a, b) => {
      const scoreA = a.scores[0]?.totalScore || 0;
      const scoreB = b.scores[0]?.totalScore || 0;
      return scoreB - scoreA;
    });
  } else if (sortBy === 'followers') {
    influencers.sort((a, b) => {
      // Total des followers sur toutes les plateformes
      const followersA = a.platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
      const followersB = b.platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
      return followersB - followersA;
    });
  } else if (sortBy === 'name') {
    influencers.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card-glass p-4 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-apple-blue-500 to-apple-purple-500 rounded-apple shadow-apple">
              <UserGroupIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-title-1 md:text-display font-bold text-apple-gray-900">Influenceurs</h1>
              <p className="text-footnote md:text-callout text-apple-gray-600 mt-0.5 md:mt-1">{influencers.length} profils actifs</p>
            </div>
          </div>
          <Link
            href="/influencers/new"
            className="btn-primary flex items-center space-x-2 hover-scale text-callout w-full sm:w-auto justify-center"
          >
            <SparklesIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span>Nouveau</span>
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="card-glass p-4 md:p-6">
        <FilterBar />
      </div>

      {/* Liste Grid */}
      {influencers.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <div className="text-6xl mb-4 opacity-20">👥</div>
          <p className="text-title-3 text-apple-gray-600">Aucun influenceur trouvé</p>
          <p className="text-callout text-apple-gray-500 mt-2">Essayez de modifier vos filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((influencer) => {
            const score = influencer.scores[0];
            const mainPlatform = influencer.platforms.find(p => p.isMain) || influencer.platforms[0];
            const totalFollowers = influencer.platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
            
            return (
              <Link
                key={influencer.id}
                href={`/influencers/${influencer.id}`}
                className="group card-glass p-6 hover-lift hover:shadow-apple-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-title-3 text-apple-gray-900 mb-2 line-clamp-1 group-hover:text-apple-blue-600 transition-colors">
                      {influencer.name}
                    </h3>
                    
                    {/* Badges plateformes */}
                    {influencer.platforms.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {influencer.platforms.map((platform) => (
                          <div
                            key={platform.id}
                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${platformColors[platform.platform]} text-white shadow-apple-sm flex items-center justify-center relative`}
                            title={platformLabels[platform.platform]}
                          >
                            <PlatformIcon platform={platform.platform} />
                            {platform.isMain && (
                              <span className="absolute -top-0.5 -right-0.5 text-[10px]">⭐</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-caption-2 text-apple-gray-400 italic">
                        Aucune plateforme configurée
                      </div>
                    )}
                  </div>
                  
                  {/* Score Badge */}
                  {score && (
                    <div className="ml-4 flex-shrink-0">
                      <div className={`relative w-20 h-20 flex flex-col items-center justify-center rounded-apple-lg ${
                        score.totalScore >= 80 ? 'bg-gradient-to-br from-green-400 to-green-500' :
                        score.totalScore >= 60 ? 'bg-gradient-to-br from-apple-blue-400 to-apple-blue-500' :
                        score.totalScore >= 40 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                        'bg-gradient-to-br from-orange-400 to-orange-500'
                      } shadow-apple text-white`}>
                        <span className="text-headline font-bold">{score.totalScore.toFixed(0)}</span>
                        <span className="text-caption opacity-90">/100</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  {totalFollowers > 0 && (
                    <div className="flex items-center space-x-3 text-callout">
                      <div className="p-2 bg-apple-gray-100 rounded-apple">
                        <UserGroupIcon className="w-4 h-4 text-apple-gray-600" />
                      </div>
                      <div>
                        <div className="text-caption-2 text-apple-gray-500">Total Abonnés</div>
                        <div className="font-semibold text-apple-gray-900">
                          {totalFollowers.toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {influencer.location && (
                    <div className="flex items-center space-x-3 text-callout">
                      <div className="p-2 bg-apple-gray-100 rounded-apple">
                        <MapPinIcon className="w-4 h-4 text-apple-gray-600" />
                      </div>
                      <span className="text-apple-gray-700">{influencer.location}</span>
                    </div>
                  )}
                </div>

                {/* Score Breakdown */}
                {score && (
                  <div className="pt-4 border-t border-apple-gray-200">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {score.weightImpactCollabs > 0 && (
                        <div className="flex items-center justify-between text-footnote">
                          <span className="text-apple-gray-600">Impact</span>
                          <span className="font-semibold text-apple-gray-900">{score.impactCollabsScore.toFixed(0)}</span>
                        </div>
                      )}
                      {score.weightOrganicPotential > 0 && (
                        <div className="flex items-center justify-between text-footnote">
                          <span className="text-apple-gray-600">Organique</span>
                          <span className="font-semibold text-apple-gray-900">{score.organicPotentialScore.toFixed(0)}</span>
                        </div>
                      )}
                      {score.weightProfitability > 0 && (
                        <div className="flex items-center justify-between text-footnote">
                          <span className="text-apple-gray-600">Rentabilité</span>
                          <span className="font-semibold text-apple-gray-900">{score.profitabilityScore.toFixed(0)}</span>
                        </div>
                      )}
                      {score.weightStrategicFit > 0 && (
                        <div className="flex items-center justify-between text-footnote">
                          <span className="text-apple-gray-600">Fit</span>
                          <span className="font-semibold text-apple-gray-900">{score.strategicFitScore.toFixed(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* ROI Badge */}
                    {score.roiScore && (
                      <div className={`flex items-center justify-between px-3 py-2 rounded-apple ${
                        score.roiScore >= 75 ? 'bg-green-100' :
                        score.roiScore >= 60 ? 'bg-yellow-100' :
                        score.roiScore >= 40 ? 'bg-orange-100' : 'bg-red-100'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <ChartBarIcon className={`w-4 h-4 ${
                            score.roiScore >= 75 ? 'text-green-600' :
                            score.roiScore >= 60 ? 'text-yellow-600' :
                            score.roiScore >= 40 ? 'text-orange-600' : 'text-red-600'
                          }`} />
                          <span className="text-footnote text-apple-gray-700 font-medium">ROI estimé</span>
                        </div>
                        <span className={`text-subhead font-bold ${
                          score.roiScore >= 75 ? 'text-green-600' :
                          score.roiScore >= 60 ? 'text-yellow-600' :
                          score.roiScore >= 40 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {score.roiScore}/100
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {!score && (
                  <div className="pt-4 border-t border-apple-gray-200 text-center">
                    <p className="text-footnote text-apple-gray-500">Pas encore évalué</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Bouton flottant de recherche */}
      <FloatingSearchButton />
    </div>
  );
}

