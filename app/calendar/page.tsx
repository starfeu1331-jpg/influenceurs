import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CalendarView } from '@/components/calendar/calendar-view';

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const currentDate = new Date();
  const selectedMonth = searchParams.month ? parseInt(searchParams.month) : currentDate.getMonth();
  const selectedYear = searchParams.year ? parseInt(searchParams.year) : currentDate.getFullYear();

  // Récupérer tous les projets planifiés (non refusés)
  const projects = await prisma.project.findMany({
    where: {
      status: {
        notIn: ['REFUSE'],
      },
      OR: [
        { plannedStartDate: { not: null } },
        { plannedEndDate: { not: null } },
        { actualStartDate: { not: null } },
        { actualEndDate: { not: null } },
      ],
    },
    include: {
      influencer: true,
      projectCollaborationStats: true,
    },
    orderBy: { plannedStartDate: 'asc' },
  });

  // Statistiques
  const planifiedProjects = projects.filter(
    (p) => p.plannedStartDate && !['TERMINE', 'REFUSE'].includes(p.status)
  ).length;

  const inProgressProjects = projects.filter((p) => p.status === 'EN_COURS').length;

  const completedThisMonth = projects.filter((p) => {
    if (!p.actualEndDate) return false;
    const endDate = new Date(p.actualEndDate);
    return endDate.getMonth() === selectedMonth && endDate.getFullYear() === selectedYear;
  }).length;

  // Détecter les conflits (même influenceur, dates qui se chevauchent)
  const conflicts: Array<{
    influencerName: string;
    projects: typeof projects;
  }> = [];

  const influencerMap = new Map<string, typeof projects>();
  
  projects.forEach((project) => {
    if (!influencerMap.has(project.influencerId)) {
      influencerMap.set(project.influencerId, []);
    }
    influencerMap.get(project.influencerId)!.push(project);
  });

  influencerMap.forEach((influencerProjects, influencerId) => {
    if (influencerProjects.length < 2) return;

    // Vérifier les chevauchements
    for (let i = 0; i < influencerProjects.length; i++) {
      for (let j = i + 1; j < influencerProjects.length; j++) {
        const p1 = influencerProjects[i];
        const p2 = influencerProjects[j];

        const start1 = p1.plannedStartDate || p1.actualStartDate;
        const end1 = p1.plannedEndDate || p1.actualEndDate;
        const start2 = p2.plannedStartDate || p2.actualStartDate;
        const end2 = p2.plannedEndDate || p2.actualEndDate;

        if (!start1 || !end1 || !start2 || !end2) continue;

        // Vérifier chevauchement
        if (start1 <= end2 && start2 <= end1) {
          // Conflit détecté
          const existingConflict = conflicts.find((c) => c.influencerName === p1.influencer.name);
          if (existingConflict) {
            if (!existingConflict.projects.includes(p1)) existingConflict.projects.push(p1);
            if (!existingConflict.projects.includes(p2)) existingConflict.projects.push(p2);
          } else {
            conflicts.push({
              influencerName: p1.influencer.name,
              projects: [p1, p2],
            });
          }
        }
      }
    }
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="card-glass p-3 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📅 Calendrier des Projets
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Visualisez et gérez votre planning de collaborations</p>
            </div>

            <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <Link
                href="/projects/pipeline"
                className="flex-1 sm:flex-initial px-3 md:px-4 py-2 bg-white/50 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/80 transition-all shadow-sm text-sm md:text-base text-center"
              >
                📋 Pipeline
              </Link>
              <Link
                href="/projects/new"
                className="flex-1 sm:flex-initial px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg text-sm md:text-base text-center"
              >
                ➕ Nouveau Projet
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="card-glass p-3 md:p-4">
              <div className="text-xs md:text-sm text-gray-600">Projets Planifiés</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{planifiedProjects}</div>
            </div>

            <div className="card-glass bg-gradient-to-br from-purple-500 to-purple-600 p-3 md:p-4 text-white">
              <div className="text-xs md:text-sm opacity-90">En Cours</div>
              <div className="text-2xl md:text-3xl font-bold">{inProgressProjects}</div>
            </div>

            <div className="card-glass bg-gradient-to-br from-green-500 to-emerald-600 p-3 md:p-4 text-white">
              <div className="text-xs md:text-sm opacity-90">Terminés ce mois</div>
              <div className="text-2xl md:text-3xl font-bold">{completedThisMonth}</div>
            </div>

            <div className="card-glass bg-gradient-to-br from-orange-500 to-red-600 p-3 md:p-4 text-white">
              <div className="text-xs md:text-sm opacity-90">Conflits Détectés</div>
              <div className="text-2xl md:text-3xl font-bold">{conflicts.length}</div>
            </div>
          </div>

          {/* Alertes Conflits */}
          {conflicts.length > 0 && (
            <div className="mt-3 md:mt-4 card-glass bg-red-50 border border-red-200 p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-xl md:text-2xl">⚠️</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-semibold text-red-900 mb-2">
                    {conflicts.length} conflit{conflicts.length > 1 ? 's' : ''} de planning détecté
                    {conflicts.length > 1 ? 's' : ''}
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    {conflicts.map((conflict, idx) => (
                      <div key={idx} className="text-xs md:text-sm text-red-800">
                        <span className="font-semibold">{conflict.influencerName}</span> :{' '}
                        {conflict.projects.length} projets avec dates qui se chevauchent
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendrier */}
        <CalendarView
          projects={projects}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}
