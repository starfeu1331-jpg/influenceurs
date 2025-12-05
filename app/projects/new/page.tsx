import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CreateProjectForm } from '@/components/projects/create-project-form';

export default async function NewProjectPage() {
  // Récupérer tous les influenceurs avec leurs plateformes
  const influencers = await prisma.influencer.findMany({
    orderBy: { name: 'asc' },
    select: { 
      id: true, 
      name: true,
      platforms: {
        select: {
          platform: true,
          isMain: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card-glass p-6">
          <Link href="/projects/pipeline" className="text-blue-600 hover:text-blue-800 inline-block mb-4">
            ← Retour au Pipeline
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ➕ Nouveau Projet
          </h1>
          <p className="text-gray-600 mt-2">Créez un nouveau projet de collaboration</p>
        </div>

        <CreateProjectForm influencers={influencers} />
      </div>
    </div>
  );
}
