'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type CreateProjectInput = {
  name: string;
  description?: string;
  influencerId: string;
  status?: string;
  proposedBy?: string;
  proposedDate?: Date;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  budgetAlloue?: number;
  platform?: string;
  formatType?: string;
  predictedViews?: number;
  predictedLikes?: number;
  predictedComments?: number;
  predictedCPV?: number;
  priority?: string;
  tags?: string;
  notes?: string;
  nextActionDate?: Date;
  reminderSet?: boolean;
};

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  id: string;
};

/**
 * Créer un nouveau projet
 */
export async function createProject(input: CreateProjectInput): Promise<
  { success: true; project: any } | { success: false; error: string }
> {
  try {
    const project = await prisma.project.create({
      data: {
        ...input,
        status: input.status || 'PROPOSE',
        priority: input.priority || 'MEDIUM',
      },
      include: {
        influencer: true,
      },
    });

    revalidatePath('/projects');
    revalidatePath('/projects/pipeline');
    revalidatePath('/calendar');
    revalidatePath(`/influencers/${input.influencerId}`);

    return { success: true, project };
  } catch (error) {
    console.error('Erreur création projet:', error);
    return { success: false, error: 'Erreur lors de la création du projet' };
  }
}

/**
 * Mettre à jour un projet
 */
export async function updateProject(input: UpdateProjectInput) {
  try {
    const { id, ...data } = input;

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        influencer: true,
      },
    });

    revalidatePath('/projects');
    revalidatePath('/projects/pipeline');
    revalidatePath('/calendar');
    revalidatePath(`/projects/${id}`);
    revalidatePath(`/influencers/${project.influencerId}`);

    return { success: true, project };
  } catch (error) {
    console.error('Erreur mise à jour projet:', error);
    return { success: false, error: 'Erreur lors de la mise à jour du projet' };
  }
}

/**
 * Changer le statut d'un projet dans le pipeline
 */
export async function updateProjectStatus(projectId: string, newStatus: string) {
  try {
    // Si passage à EN_COURS, mettre actualStartDate
    const updates: any = { status: newStatus };
    
    if (newStatus === 'EN_COURS') {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (project && !project.actualStartDate) {
        updates.actualStartDate = new Date();
      }
    }

    // Si passage à TERMINE, mettre actualEndDate
    if (newStatus === 'TERMINE') {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (project && !project.actualEndDate) {
        updates.actualEndDate = new Date();
      }
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updates,
      include: {
        influencer: true,
      },
    });

    revalidatePath('/projects/pipeline');
    revalidatePath('/calendar');
    revalidatePath(`/projects/${projectId}`);

    return { success: true, project };
  } catch (error) {
    console.error('Erreur changement statut projet:', error);
    return { success: false, error: 'Erreur lors du changement de statut' };
  }
}

/**
 * Supprimer un projet
 */
export async function deleteProject(projectId: string) {
  try {
    const project = await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath('/projects');
    revalidatePath('/projects/pipeline');
    revalidatePath('/calendar');
    revalidatePath(`/influencers/${project.influencerId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur suppression projet:', error);
    return { success: false, error: 'Erreur lors de la suppression du projet' };
  }
}

/**
 * Obtenir tous les projets d'un influenceur
 */
export async function getInfluencerProjects(influencerId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { influencerId },
      include: {
        projectCollaborationStats: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, projects };
  } catch (error) {
    console.error('Erreur récupération projets:', error);
    return { success: false, error: 'Erreur lors de la récupération des projets' };
  }
}

/**
 * Détecter les conflits de planning (même influenceur, dates qui se chevauchent)
 */
export async function detectCalendarConflicts(
  influencerId: string,
  startDate: Date,
  endDate: Date,
  excludeProjectId?: string
) {
  try {
    const conflicts = await prisma.project.findMany({
      where: {
        influencerId,
        id: excludeProjectId ? { not: excludeProjectId } : undefined,
        status: {
          in: ['ACCORD', 'EN_COURS', 'PROPOSITION'],
        },
        OR: [
          {
            AND: [
              { plannedStartDate: { lte: endDate } },
              { plannedEndDate: { gte: startDate } },
            ],
          },
        ],
      },
      include: {
        influencer: true,
      },
    });

    return { success: true, conflicts };
  } catch (error) {
    console.error('Erreur détection conflits:', error);
    return { success: false, error: 'Erreur lors de la détection des conflits' };
  }
}

/**
 * Obtenir les projets avec rappel (reminder) pour aujourd'hui ou passés
 */
export async function getProjectsWithReminders() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const projects = await prisma.project.findMany({
      where: {
        reminderSet: true,
        nextActionDate: {
          lte: today,
        },
        status: {
          notIn: ['TERMINE', 'REFUSE'],
        },
      },
      include: {
        influencer: true,
      },
      orderBy: { nextActionDate: 'asc' },
    });

    return { success: true, projects };
  } catch (error) {
    console.error('Erreur récupération rappels:', error);
    return { success: false, error: 'Erreur lors de la récupération des rappels' };
  }
}

/**
 * Obtenir projets bloqués (pas de mise à jour depuis X jours)
 */
export async function getStaledProjects(daysSinceUpdate: number = 14) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceUpdate);

    const projects = await prisma.project.findMany({
      where: {
        status: {
          in: ['PREMIER_CONTACT', 'NEGOCIATION', 'PROPOSITION'],
        },
        lastContactDate: {
          lte: cutoffDate,
        },
      },
      include: {
        influencer: true,
      },
      orderBy: { lastContactDate: 'asc' },
    });

    return { success: true, projects };
  } catch (error) {
    console.error('Erreur récupération projets bloqués:', error);
    return { success: false, error: 'Erreur lors de la récupération des projets bloqués' };
  }
}
