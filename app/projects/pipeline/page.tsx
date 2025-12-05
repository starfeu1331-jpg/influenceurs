import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { PipelineBoard } from '@/components/pipeline/pipeline-board';

const PROJECT_STATUSES = [
  { key: 'PROPOSE', label: 'Proposé', emoji: '💡', color: 'bg-cyan-100' },
  { key: 'PROSPECTION', label: 'Prospection', emoji: '🔍', color: 'bg-gray-100' },
  { key: 'PREMIER_CONTACT', label: 'Premier Contact', emoji: '👋', color: 'bg-blue-100' },
  { key: 'NEGOCIATION', label: 'Négociation', emoji: '💬', color: 'bg-yellow-100' },
  { key: 'PROPOSITION', label: 'Proposition', emoji: '📤', color: 'bg-orange-100' },
  { key: 'ACCORD', label: 'Accord', emoji: '🤝', color: 'bg-green-100' },
  { key: 'EN_COURS', label: 'En Cours', emoji: '🔄', color: 'bg-purple-100' },
  { key: 'TERMINE', label: 'Terminé', emoji: '✅', color: 'bg-emerald-100' },
];

const OTHER_STATUSES = [
  { key: 'REFUSE', label: 'Refusé', emoji: '❌', color: 'bg-red-100' },
  { key: 'A_RECONTACTER', label: 'À Recontacter', emoji: '⏰', color: 'bg-indigo-100' },
];

export default async function PipelinePage() {
  // Récupérer tous les projets groupés par statut
  const projects = await prisma.project.findMany({
    include: {
      influencer: true,
      projectCollaborationStats: true,
    },
    orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }],
  });

  // Grouper par statut
  const projectsByStatus: Record<string, typeof projects> = {};
  [...PROJECT_STATUSES, ...OTHER_STATUSES].forEach((status) => {
    projectsByStatus[status.key] = projects.filter((p) => p.status === status.key);
  });

  // Calculer stats globales
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) =>
    ['PREMIER_CONTACT', 'NEGOCIATION', 'PROPOSITION', 'ACCORD', 'EN_COURS'].includes(p.status)
  ).length;
  const completedProjects = projectsByStatus['TERMINE'].length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budgetAlloue || 0), 0);

  // Projets avec rappels
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const projectsWithDueReminders = projects.filter(
    (p) =>
      p.reminderSet &&
      p.nextActionDate &&
      p.nextActionDate <= today &&
      !['TERMINE', 'REFUSE'].includes(p.status)
  );

  // Projets bloqués (pas de lastContactDate depuis 14 jours)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const staledProjects = projects.filter(
    (p) =>
      ['PREMIER_CONTACT', 'NEGOCIATION', 'PROPOSITION'].includes(p.status) &&
      (!p.lastContactDate || p.lastContactDate <= fourteenDaysAgo)
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="card-glass p-3 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                📋 Pipeline des Projets
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Gérez le cycle de vie complet de vos collaborations</p>
            </div>

            <Link
              href="/projects/new"
              className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm md:text-base w-full sm:w-auto text-center"
            >
              ➕ Nouveau Projet
            </Link>
          </div>

          {/* Stats globales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="card-glass p-3 md:p-4">
              <div className="text-xs md:text-sm text-gray-600">Total Projets</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalProjects}</div>
            </div>

            <div className="card-glass bg-gradient-to-br from-blue-500 to-blue-600 p-3 md:p-4 text-white">
              <div className="text-xs md:text-sm opacity-90">Projets Actifs</div>
              <div className="text-2xl md:text-3xl font-bold">{activeProjects}</div>
            </div>

            <div className="card-glass bg-gradient-to-br from-green-500 to-emerald-600 p-3 md:p-4 text-white">
              <div className="text-xs md:text-sm opacity-90">Terminés</div>
              <div className="text-2xl md:text-3xl font-bold">{completedProjects}</div>
            </div>

            <div className="card-glass bg-gradient-to-br from-purple-500 to-purple-600 p-3 md:p-4 text-white">
              <div className="text-xs md:text-sm opacity-90">Budget Total</div>
              <div className="text-xl md:text-3xl font-bold">{totalBudget.toLocaleString()}€</div>
            </div>
          </div>

          {/* Alertes */}
          {(projectsWithDueReminders.length > 0 || staledProjects.length > 0) && (
            <div className="mt-3 md:mt-4 space-y-2">
              {projectsWithDueReminders.length > 0 && (
                <div className="card-glass bg-orange-50 border border-orange-200 p-3 md:p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl md:text-2xl">⚠️</span>
                    <div>
                      <div className="text-sm md:text-base font-semibold text-orange-900">
                        {projectsWithDueReminders.length} rappel{projectsWithDueReminders.length > 1 ? 's' : ''} en
                        attente
                      </div>
                      <div className="text-sm text-orange-700">
                        Actions à faire aujourd'hui ou en retard
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {staledProjects.length > 0 && (
                <div className="card-glass bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚨</span>
                    <div>
                      <div className="font-semibold text-red-900">
                        {staledProjects.length} projet{staledProjects.length > 1 ? 's' : ''} bloqué
                        {staledProjects.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-red-700">Aucun contact depuis plus de 14 jours</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Board Kanban */}
        <PipelineBoard
          statuses={PROJECT_STATUSES}
          otherStatuses={OTHER_STATUSES}
          projectsByStatus={projectsByStatus}
        />
      </div>
    </div>
  );
}
