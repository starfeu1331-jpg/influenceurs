import Link from 'next/link';

type Project = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  proposedBy: string | null;
  proposedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function ProjectHeader({ project }: { project: Project }) {
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; emoji: string }> = {
      PROPOSE: { color: 'bg-cyan-200 text-cyan-900', label: 'Proposé', emoji: '💡' },
      PROSPECTION: { color: 'bg-gray-200 text-gray-800', label: 'Prospection', emoji: '🔍' },
      PREMIER_CONTACT: { color: 'bg-blue-200 text-blue-900', label: 'Premier Contact', emoji: '👋' },
      NEGOCIATION: { color: 'bg-yellow-200 text-yellow-900', label: 'Négociation', emoji: '💬' },
      PROPOSITION: { color: 'bg-orange-200 text-orange-900', label: 'Proposition', emoji: '📤' },
      ACCORD: { color: 'bg-green-200 text-green-900', label: 'Accord', emoji: '🤝' },
      EN_COURS: { color: 'bg-purple-200 text-purple-900', label: 'En Cours', emoji: '🔄' },
      TERMINE: { color: 'bg-emerald-200 text-emerald-900', label: 'Terminé', emoji: '✅' },
      REFUSE: { color: 'bg-red-200 text-red-900', label: 'Refusé', emoji: '❌' },
      A_RECONTACTER: { color: 'bg-indigo-200 text-indigo-900', label: 'À Recontacter', emoji: '⏰' },
    };

    const badge = badges[status] || badges.PROPOSE;
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.color}`}>
        {badge.emoji} {badge.label}
      </span>
    );
  };

  return (
    <div className="card-glass p-6 mb-6">
      <Link href="/projects/pipeline" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Retour au Pipeline
      </Link>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
          {project.description && <p className="text-gray-600 mb-4">{project.description}</p>}
          
          {/* NOUVEAU: Info proposition */}
          {project.proposedBy && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3 mb-4 inline-block">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="text-sm font-semibold text-cyan-900">Proposé par</div>
                  <div className="text-base text-cyan-800">{project.proposedBy}</div>
                  {project.proposedDate && (
                    <div className="text-xs text-cyan-600 mt-1">
                      Le {new Date(project.proposedDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
          </div>
        </div>

        <div>{getStatusBadge(project.status)}</div>
      </div>
    </div>
  );
}
