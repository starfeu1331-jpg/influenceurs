'use client';

import { useState } from 'react';
import Link from 'next/link';

type Influencer = {
  id: string;
  name: string;
  mainPlatform: string;
};

type Project = {
  id: string;
  name: string;
  status: string;
  influencer: Influencer;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  actualStartDate: Date | null;
  actualEndDate: Date | null;
  budgetAlloue: number | null;
  priority: string | null;
};

type Props = {
  projects: Project[];
  selectedMonth: number;
  selectedYear: number;
};

export function CalendarView({ projects, selectedMonth, selectedYear }: Props) {
  const [viewMode, setViewMode] = useState<'month' | 'quarter'>('month');

  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  // Navigation
  const goToPrevious = () => {
    if (viewMode === 'month') {
      const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
      const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
      window.location.href = `/calendar?month=${prevMonth}&year=${prevYear}`;
    } else {
      const prevQuarter = Math.floor(selectedMonth / 3) - 1;
      const targetQuarter = prevQuarter < 0 ? 3 : prevQuarter;
      const targetYear = prevQuarter < 0 ? selectedYear - 1 : selectedYear;
      const targetMonth = targetQuarter * 3;
      window.location.href = `/calendar?month=${targetMonth}&year=${targetYear}`;
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
      const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
      window.location.href = `/calendar?month=${nextMonth}&year=${nextYear}`;
    } else {
      const nextQuarter = Math.floor(selectedMonth / 3) + 1;
      const targetQuarter = nextQuarter > 3 ? 0 : nextQuarter;
      const targetYear = nextQuarter > 3 ? selectedYear + 1 : selectedYear;
      const targetMonth = targetQuarter * 3;
      window.location.href = `/calendar?month=${targetMonth}&year=${targetYear}`;
    }
  };

  // Filtrer projets par période
  const getProjectsForPeriod = () => {
    if (viewMode === 'month') {
      return projects.filter((p) => {
        const hasDate =
          p.plannedStartDate || p.plannedEndDate || p.actualStartDate || p.actualEndDate;
        if (!hasDate) return false;

        const dates = [p.plannedStartDate, p.plannedEndDate, p.actualStartDate, p.actualEndDate]
          .filter((d) => d !== null)
          .map((d) => new Date(d!));

        return dates.some(
          (date) => date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
        );
      });
    } else {
      // Trimestre
      const quarterStart = Math.floor(selectedMonth / 3) * 3;
      const quarterEnd = quarterStart + 2;

      return projects.filter((p) => {
        const hasDate =
          p.plannedStartDate || p.plannedEndDate || p.actualStartDate || p.actualEndDate;
        if (!hasDate) return false;

        const dates = [p.plannedStartDate, p.plannedEndDate, p.actualStartDate, p.actualEndDate]
          .filter((d) => d !== null)
          .map((d) => new Date(d!));

        return dates.some(
          (date) =>
            date.getMonth() >= quarterStart &&
            date.getMonth() <= quarterEnd &&
            date.getFullYear() === selectedYear
        );
      });
    }
  };

  const filteredProjects = getProjectsForPeriod();

  // Grouper par semaine/mois
  const groupedProjects =
    viewMode === 'month'
      ? groupByWeek(filteredProjects, selectedMonth, selectedYear)
      : groupByMonth(filteredProjects, selectedMonth, selectedYear);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PROPOSE: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      PROSPECTION: 'bg-gray-100 text-gray-800 border-gray-200',
      PREMIER_CONTACT: 'bg-blue-100 text-blue-800 border-blue-200',
      NEGOCIATION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PROPOSITION: 'bg-orange-100 text-orange-800 border-orange-200',
      ACCORD: 'bg-green-100 text-green-800 border-green-200',
      EN_COURS: 'bg-purple-100 text-purple-800 border-purple-200',
      TERMINE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      REFUSE: 'bg-red-100 text-red-800 border-red-200',
      A_RECONTACTER: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return null;
    const colors: Record<string, string> = {
      HIGH: 'bg-red-500 text-white',
      MEDIUM: 'bg-yellow-500 text-white',
      LOW: 'bg-green-500 text-white',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded ${colors[priority] || 'bg-gray-500 text-white'}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Navigation et mode */}
      <div className="card-glass p-3 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={goToPrevious}
              className="px-3 md:px-4 py-2 bg-white/50 hover:bg-white/80 rounded-lg transition-colors text-lg md:text-xl border border-gray-200"
            >
              ←
            </button>

            <h2 className="text-lg md:text-2xl font-bold text-gray-900 whitespace-nowrap">
              {viewMode === 'month'
                ? `${monthNames[selectedMonth]} ${selectedYear}`
                : `T${Math.floor(selectedMonth / 3) + 1} ${selectedYear}`}
            </h2>

            <button
              onClick={goToNext}
              className="px-3 md:px-4 py-2 bg-white/50 hover:bg-white/80 rounded-lg transition-colors text-lg md:text-xl border border-gray-200"
            >
              →
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('month')}
              className={`flex-1 sm:flex-initial px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                viewMode === 'month'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700 border border-gray-200'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewMode('quarter')}
              className={`flex-1 sm:flex-initial px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                viewMode === 'quarter'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700 border border-gray-200'
              }`}
            >
              Trimestre
            </button>
          </div>
        </div>
      </div>

      {/* Projets */}
      <div className="space-y-4 md:space-y-6">
        {Object.entries(groupedProjects).map(([period, periodProjects]) => (
          <div key={period} className="card-glass p-3 md:p-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-l-4 border-purple-500 pl-3">{period}</h3>

            <div className="space-y-2">
              {(periodProjects as Project[]).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block bg-white/50 hover:bg-white/80 border border-gray-200 rounded-lg p-3 md:p-4 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 md:gap-4">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-start sm:items-center gap-2 mb-1 md:mb-2 flex-wrap">
                        <div className="font-semibold text-gray-900 text-sm md:text-base break-words">{project.name}</div>
                        {getPriorityBadge(project.priority)}
                      </div>

                      <div className="text-xs md:text-sm text-gray-600 mb-1 truncate">
                        👤 {project.influencer.name}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                        {project.plannedStartDate && (
                          <div className="break-words">
                            📅 Prévu:{' '}
                            {new Date(project.plannedStartDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                            {project.plannedEndDate &&
                              ` → ${new Date(project.plannedEndDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}`}
                          </div>
                        )}
                        {project.budgetAlloue && (
                          <div className="font-semibold text-green-700 whitespace-nowrap">
                            {project.budgetAlloue.toLocaleString()}€
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span
                        className={`text-xs px-2 md:px-3 py-1 rounded-full whitespace-nowrap border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedProjects).length === 0 && (
          <div className="card-glass p-12 text-center text-gray-400">
            <div className="text-4xl mb-4">📭</div>
            <div>Aucun projet planifié pour cette période</div>
          </div>
        )}
      </div>
    </div>
  );
}

function groupByWeek(projects: Project[], month: number, year: number) {
  const groups: Record<string, Project[]> = {};

  projects.forEach((project) => {
    const date =
      project.plannedStartDate ||
      project.plannedEndDate ||
      project.actualStartDate ||
      project.actualEndDate;
    if (!date) return;

    const d = new Date(date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const label = `Semaine du ${weekStart.getDate()}/${weekStart.getMonth() + 1} au ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;

    if (!groups[label]) groups[label] = [];
    groups[label].push(project);
  });

  return groups;
}

function groupByMonth(projects: Project[], startMonth: number, year: number) {
  const groups: Record<string, Project[]> = {};
  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const quarterStart = Math.floor(startMonth / 3) * 3;

  for (let i = 0; i < 3; i++) {
    const monthIndex = quarterStart + i;
    const label = monthNames[monthIndex];
    groups[label] = [];
  }

  projects.forEach((project) => {
    const date =
      project.plannedStartDate ||
      project.plannedEndDate ||
      project.actualStartDate ||
      project.actualEndDate;
    if (!date) return;

    const d = new Date(date);
    const monthIndex = d.getMonth();
    const label = monthNames[monthIndex];

    if (groups[label]) {
      groups[label].push(project);
    }
  });

  return groups;
}
