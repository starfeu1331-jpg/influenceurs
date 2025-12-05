import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectHeader } from '@/components/projects/project-header';
import { ProjectPerformanceTracker } from '@/components/projects/project-performance-tracker';
import { ProjectEditForm } from '@/components/projects/project-edit-form';
import { CollaborationStatsForm } from '@/components/projects/collaboration-stats-form';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      influencer: {
        include: {
          scores: {
            orderBy: { computedAt: 'desc' },
            take: 1,
          },
        },
      },
      projectCollaborationStats: true,
    },
  });

  if (!project) {
    notFound();
  }

  const latestScore = project.influencer.scores[0];

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProjectHeader project={project} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulaire d'édition */}
            <ProjectEditForm project={project} />

            {/* Tracker de performance (si terminé) */}
            {project.status === 'TERMINE' && project.projectCollaborationStats && (
              <ProjectPerformanceTracker project={project} stats={project.projectCollaborationStats} />
            )}

            {/* Formulaire stats collaboration */}
            {(project.status === 'TERMINE' || project.status === 'EN_COURS') && (
              <CollaborationStatsForm project={project} existingStats={project.projectCollaborationStats} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info influenceur */}
            <div className="card-glass p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Influenceur</h3>

              <Link
                href={`/influencers/${project.influencer.id}`}
                className="block hover:bg-gray-50 rounded-lg p-3 transition-colors"
              >
                <div className="font-semibold text-blue-600">{project.influencer.name}</div>
                <div className="text-sm text-gray-600 mt-1">{project.influencer.mainPlatform}</div>
                {project.influencer.followers && (
                  <div className="text-sm text-gray-600">
                    {project.influencer.followers.toLocaleString()} abonnés
                  </div>
                )}
                {latestScore && (
                  <div className="mt-2 text-sm font-semibold text-green-700">
                    Score: {latestScore.totalScore.toFixed(0)}/100
                  </div>
                )}
              </Link>
            </div>

            {/* Actions rapides */}
            <div className="card-glass p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Actions</h3>

              <div className="space-y-2">
                <Link
                  href="/projects/pipeline"
                  className="block w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-center"
                >
                  📋 Voir Pipeline
                </Link>

                <Link
                  href="/calendar"
                  className="block w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-center"
                >
                  📅 Voir Calendrier
                </Link>

                <Link
                  href={`/influencers/${project.influencer.id}`}
                  className="block w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-center"
                >
                  👤 Profil Influenceur
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
