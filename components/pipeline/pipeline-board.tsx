'use client';

import { useState } from 'react';
import { updateProjectStatus } from '@/lib/actions/projects';
import Link from 'next/link';

type Status = {
  key: string;
  label: string;
  emoji: string;
  color: string;
};

type Influencer = {
  id: string;
  name: string;
  platforms?: {
    platform: string;
    isMain: boolean;
  }[];
};

type Project = {
  id: string;
  name: string;
  status: string;
  influencer: Influencer;
  budgetAlloue: number | null;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  priority: string | null;
  lastContactDate: Date | null;
  nextActionDate: Date | null;
  reminderSet: boolean;
  tags: string | null;
  proposedBy: string | null;
  proposedDate: Date | null;
};

type Props = {
  statuses: Status[];
  otherStatuses: Status[];
  projectsByStatus: Record<string, Project[]>;
};

export function PipelineBoard({ statuses, otherStatuses, projectsByStatus }: Props) {
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  const handleDragStart = (project: Project) => {
    setDraggedProject(project);
  };

  const handleDragOver = (e: React.DragEvent, statusKey: string) => {
    e.preventDefault();
    setHoveredStatus(statusKey);
  };

  const handleDragLeave = () => {
    setHoveredStatus(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setHoveredStatus(null);

    if (!draggedProject || draggedProject.status === newStatus) {
      setDraggedProject(null);
      return;
    }

    // Optimistic UI update
    const result = await updateProjectStatus(draggedProject.id, newStatus);

    if (result.success) {
      // Recharger la page pour voir les changements
      window.location.reload();
    } else {
      alert(result.error);
    }

    setDraggedProject(null);
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const isOverdue = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  return (
    <div className="space-y-6">
      {/* Pipeline principal */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => {
          const projects = projectsByStatus[status.key] || [];
          const totalBudget = projects.reduce((sum, p) => sum + (p.budgetAlloue || 0), 0);
          const isHovered = hoveredStatus === status.key;

          return (
            <div
              key={status.key}
              className={`flex-shrink-0 w-80 transition-all ${
                isHovered ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, status.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status.key)}
            >
              {/* Header colonne */}
              <div className={`${status.color} rounded-t-lg p-4 border-b-4 border-gray-300`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{status.emoji}</span>
                    <div>
                      <div className="font-bold text-gray-900">{status.label}</div>
                      <div className="text-sm text-gray-600">{projects.length} projets</div>
                    </div>
                  </div>
                </div>
                {totalBudget > 0 && (
                  <div className="mt-2 text-sm font-semibold text-gray-700">
                    {totalBudget.toLocaleString()}€
                  </div>
                )}
              </div>

              {/* Cartes projets */}
              <div className="bg-white/50 backdrop-blur-sm rounded-b-lg p-3 min-h-[300px] max-h-[600px] overflow-y-auto space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={() => handleDragStart(project)}
                    className="card-glass shadow-sm hover:shadow-md transition-all p-4 cursor-move border border-gray-200 hover:border-blue-400"
                  >
                    <Link href={`/projects/${project.id}`}>
                      <div className="space-y-2">
                        {/* Nom projet */}
                        <div className="font-semibold text-gray-900 text-sm hover:text-blue-600">
                          {project.name}
                        </div>

                        {/* Influenceur */}
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>👤</span>
                          <span className="truncate">{project.influencer.name}</span>
                        </div>

                        {/* NOUVEAU: Proposé par */}
                        {project.proposedBy && (
                          <div className="text-xs bg-cyan-50 border border-cyan-200 rounded px-2 py-1">
                            <span className="text-cyan-700">💡 Proposé par:</span>
                            <div className="font-medium text-cyan-900 mt-0.5">{project.proposedBy}</div>
                          </div>
                        )}

                        {/* Budget */}
                        {project.budgetAlloue && (
                          <div className="text-xs font-semibold text-green-700">
                            {project.budgetAlloue.toLocaleString()}€
                          </div>
                        )}

                        {/* Dates */}
                        {(project.plannedStartDate || project.plannedEndDate) && (
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <span>📅</span>
                            {formatDate(project.plannedStartDate)}
                            {project.plannedEndDate && (
                              <>
                                {' → '}
                                {formatDate(project.plannedEndDate)}
                              </>
                            )}
                          </div>
                        )}

                        {/* Rappel / Next Action */}
                        {project.reminderSet && project.nextActionDate && (
                          <div
                            className={`text-xs flex items-center gap-1 ${
                              isOverdue(project.nextActionDate)
                                ? 'text-red-600 font-semibold'
                                : 'text-orange-600'
                            }`}
                          >
                            <span>{isOverdue(project.nextActionDate) ? '🚨' : '⏰'}</span>
                            {formatDate(project.nextActionDate)}
                          </div>
                        )}

                        {/* Priorité */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {project.priority && (
                            <span
                              className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
                                project.priority
                              )}`}
                            >
                              {project.priority}
                            </span>
                          )}

                          {/* Tags */}
                          {project.tags && (
                            <div className="flex gap-1 flex-wrap">
                              {project.tags.split(',').slice(0, 2).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200"
                                >
                                  #{tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center text-gray-400 py-8 text-sm">Aucun projet</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Autres statuts (Refusé, À recontacter) */}
      <div className="border-t-2 border-dashed border-gray-300 pt-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">📦 Archivés / En Attente</h2>

        <div className="flex gap-4 overflow-x-auto">
          {otherStatuses.map((status) => {
            const projects = projectsByStatus[status.key] || [];
            const isHovered = hoveredStatus === status.key;

            return (
              <div
                key={status.key}
                className={`flex-shrink-0 w-80 transition-all ${
                  isHovered ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, status.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status.key)}
              >
                {/* Header colonne */}
                <div className={`${status.color} rounded-t-lg p-4 border-b-4 border-gray-300`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{status.emoji}</span>
                    <div>
                      <div className="font-bold text-gray-900">{status.label}</div>
                      <div className="text-sm text-gray-600">{projects.length} projets</div>
                    </div>
                  </div>
                </div>

                {/* Cartes projets */}
                <div className="bg-white/50 backdrop-blur-sm rounded-b-lg p-3 min-h-[200px] max-h-[400px] overflow-y-auto space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      draggable
                      onDragStart={() => handleDragStart(project)}
                      className="card-glass shadow-sm hover:shadow-md transition-all p-4 cursor-move border border-gray-200 opacity-75 hover:opacity-100"
                    >
                      <Link href={`/projects/${project.id}`}>
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-900 text-sm">{project.name}</div>
                          <div className="text-xs text-gray-600">👤 {project.influencer.name}</div>
                          {project.lastContactDate && (
                            <div className="text-xs text-gray-500">
                              Dernier contact : {formatDate(project.lastContactDate)}
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">Aucun projet</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
