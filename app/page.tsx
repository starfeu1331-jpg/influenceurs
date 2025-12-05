import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  BriefcaseIcon, 
  BanknotesIcon,
  Squares2X2Icon,
  CalendarIcon,
  ScaleIcon,
  TrophyIcon,
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default async function HomePage() {
  // Statistiques générales
  const totalInfluencers = await prisma.influencer.count();
  const totalProjects = await prisma.project.count();
  const activeProjects = await prisma.project.count({
    where: {
      status: {
        in: ['PREMIER_CONTACT', 'NEGOCIATION', 'PROPOSITION', 'ACCORD', 'EN_COURS'],
      },
    },
  });
  
  const influencersWithScores = await prisma.influencer.findMany({
    include: {
      scores: {
        orderBy: { computedAt: 'desc' },
        take: 1,
      },
    },
  });

  const scoresArray = influencersWithScores
    .map(inf => inf.scores[0]?.totalScore)
    .filter(score => score !== undefined);

  const avgScore = scoresArray.length > 0
    ? scoresArray.reduce((sum, s) => sum + s, 0) / scoresArray.length
    : 0;

  const allProjects = await prisma.project.findMany();
  const totalBudget = allProjects.reduce((sum, p) => sum + (p.budgetAlloue || 0), 0);

  const topInfluencers = influencersWithScores
    .filter(inf => inf.scores[0])
    .sort((a, b) => (b.scores[0]?.totalScore || 0) - (a.scores[0]?.totalScore || 0))
    .slice(0, 5);

  const platformLabels: Record<string, string> = {
    INSTAGRAM: 'Instagram',
    TIKTOK: 'TikTok',
    YOUTUBE: 'YouTube',
    OTHER: 'Autre',
  };

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="card-glass p-4 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-title-1 md:text-display font-bold text-apple-gray-900">
                Dashboard
              </h1>
              <p className="text-callout md:text-title-3 text-apple-gray-600">
                Gérez vos campagnes influenceurs avec intelligence
              </p>
            </div>
            <Link
              href="/projects/new"
              className="btn-primary flex items-center space-x-2 hover-scale text-callout w-full sm:w-auto justify-center"
            >
              <PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span>Nouveau projet</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards - Apple Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {/* Total Influencers */}
        <div className="card-glass p-4 md:p-6 hover-lift group">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-apple-blue-500 to-apple-blue-600 rounded-apple shadow-apple">
              <UserGroupIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <SparklesIcon className="w-4 h-4 md:w-5 md:h-5 text-apple-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <p className="text-footnote md:text-callout text-apple-gray-600 font-medium">Total influenceurs</p>
            <p className="text-title-1 md:text-display font-bold text-apple-gray-900">{totalInfluencers}</p>
            <p className="text-caption-2 md:text-footnote text-apple-gray-500">Profils actifs</p>
          </div>
        </div>

        {/* Average Score */}
        <div className="card-glass p-4 md:p-6 hover-lift group">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-apple shadow-apple">
              <ChartBarIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <SparklesIcon className="w-4 h-4 md:w-5 md:h-5 text-apple-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <p className="text-footnote md:text-callout text-apple-gray-600 font-medium">Score moyen</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-title-1 md:text-display font-bold text-apple-gray-900">{avgScore.toFixed(1)}</p>
              <span className="text-callout md:text-title-3 text-apple-gray-500">/100</span>
            </div>
            <p className="text-caption-2 md:text-footnote text-apple-gray-500">Performance globale</p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="card-glass p-4 md:p-6 hover-lift group">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-apple-purple-500 to-apple-purple-600 rounded-apple shadow-apple">
              <BriefcaseIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <SparklesIcon className="w-4 h-4 md:w-5 md:h-5 text-apple-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <p className="text-footnote md:text-callout text-apple-gray-600 font-medium">Projets actifs</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-title-1 md:text-display font-bold text-apple-gray-900">{activeProjects}</p>
              <span className="text-callout md:text-title-3 text-apple-gray-500">/{totalProjects}</span>
            </div>
            <p className="text-caption-2 md:text-footnote text-apple-gray-500">En cours de traitement</p>
          </div>
        </div>

        {/* Total Budget */}
        <div className="card-glass p-4 md:p-6 hover-lift group">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-apple shadow-apple">
              <BanknotesIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <SparklesIcon className="w-4 h-4 md:w-5 md:h-5 text-apple-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <p className="text-footnote md:text-callout text-apple-gray-600 font-medium">Budget total</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-title-1 md:text-display font-bold text-apple-gray-900">{(totalBudget / 1000).toFixed(0)}</p>
              <span className="text-callout md:text-title-3 text-apple-gray-500">k€</span>
            </div>
            <p className="text-caption-2 md:text-footnote text-apple-gray-500">Investissement global</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-glass p-4 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-apple-blue-500 to-apple-purple-500 rounded-apple">
            <Squares2X2Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-title-1 font-semibold text-apple-gray-900">Actions rapides</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/projects/pipeline"
            className="group p-5 bg-white/50 hover:bg-white/80 rounded-apple-lg border border-apple-gray-100 transition-all duration-300 hover:shadow-apple-md hover:-translate-y-0.5"
          >
            <Squares2X2Icon className="w-8 h-8 text-apple-blue-500 mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-apple-gray-900 mb-1">Pipeline</div>
            <div className="text-subhead text-apple-gray-600">Gérer les projets</div>
          </Link>

          <Link
            href="/calendar"
            className="group p-5 bg-white/50 hover:bg-white/80 rounded-apple-lg border border-apple-gray-100 transition-all duration-300 hover:shadow-apple-md hover:-translate-y-0.5"
          >
            <CalendarIcon className="w-8 h-8 text-apple-purple-500 mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-apple-gray-900 mb-1">Calendrier</div>
            <div className="text-subhead text-apple-gray-600">Planning collabs</div>
          </Link>

          <Link
            href="/influencers/compare"
            className="group p-5 bg-white/50 hover:bg-white/80 rounded-apple-lg border border-apple-gray-100 transition-all duration-300 hover:shadow-apple-md hover:-translate-y-0.5"
          >
            <ScaleIcon className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-apple-gray-900 mb-1">Comparateur</div>
            <div className="text-subhead text-apple-gray-600">Analyser influenceurs</div>
          </Link>

          <Link
            href="/influencers"
            className="group p-5 bg-white/50 hover:bg-white/80 rounded-apple-lg border border-apple-gray-100 transition-all duration-300 hover:shadow-apple-md hover:-translate-y-0.5"
          >
            <UserGroupIcon className="w-8 h-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-apple-gray-900 mb-1">Influenceurs</div>
            <div className="text-subhead text-apple-gray-600">Liste complète</div>
          </Link>
        </div>
      </div>

      {/* Top 5 Influencers */}
      <div className="card-glass p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-apple">
            <TrophyIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-title-1 font-semibold text-apple-gray-900">Top 5 influenceurs</h2>
        </div>

        {topInfluencers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">🏆</div>
            <p className="text-callout text-apple-gray-500">Aucun influenceur évalué pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topInfluencers.map((inf, index) => (
              <Link
                key={inf.id}
                href={`/influencers/${inf.id}`}
                className="group flex items-center justify-between p-5 bg-white/50 hover:bg-white/80 rounded-apple-lg border border-apple-gray-100 transition-all duration-300 hover:shadow-apple-md hover:-translate-y-0.5"
              >
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-white shadow-apple ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' : 
                    'bg-gradient-to-br from-apple-gray-300 to-apple-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <p className="font-semibold text-apple-gray-900 group-hover:text-apple-blue-600 transition-colors">
                      {inf.name}
                    </p>
                    <p className="text-subhead text-apple-gray-600">{platformLabels[inf.mainPlatform]}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-headline font-bold text-gradient-blue">
                    {inf.scores[0]?.totalScore.toFixed(1)}
                  </p>
                  <p className="text-caption text-apple-gray-500">/ 100</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="glass rounded-apple-xl p-6 border border-apple-blue-200/50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 p-3 bg-apple-blue-100 rounded-apple">
            <SparklesIcon className="w-6 h-6 text-apple-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-apple-gray-900 mb-1">Astuce professionnelle</h3>
            <p className="text-callout text-apple-gray-700">
              Renseignez le <span className="font-semibold">budget futur</span> dans vos projets pour obtenir 
              une estimation ROI automatique basée sur les performances historiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

