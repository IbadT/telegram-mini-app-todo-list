import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ShareProjectDto } from './dto/share-project.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateShareCode(): string {
    // Генерируем более удобный для пользователей код
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async create(userId: number, createProjectDto: CreateProjectDto) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Check if project with the same name already exists
      const existingProject = await this.prisma.project.findFirst({
        where: {
          name: createProjectDto.name,
          ownerId: userId,
        },
      });

      if (existingProject) {
        throw new BadRequestException(`Project with name "${createProjectDto.name}" already exists`);
      }

      // Generate share code
      const shareCode = this.generateShareCode();

      return this.prisma.project.create({
        data: {
          ...createProjectDto,
          ownerId: userId,
          shareCode,
        },
        include: {
          tasks: {
            include: {
              category: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create project');
    }
  }

  async findAll(userId: number) {
    const [ownedProjects, sharedProjects] = await Promise.all([
      // Get projects owned by user
      this.prisma.project.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          tasks: {
            include: {
              category: true,
            },
          },
        },
      }),
      // Get projects shared with user
      this.prisma.project.findMany({
        where: {
          sharedWith: {
            some: {
              userId,
            },
          },
        },
        include: {
          tasks: {
            include: {
              category: true,
            },
          },
        },
      }),
    ]);

    return [...ownedProjects, ...sharedProjects];
  }

  async findOne(userId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            sharedWith: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        tasks: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(userId: number, id: number, updateProjectDto: any) {
    const project = await this.findOne(userId, id);

    // Only owner can update project details
    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only project owner can update project details');
    }

    return this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
      include: {
        tasks: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async remove(userId: number, id: number) {
    const project = await this.findOne(userId, id);

    // Only owner can delete project
    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only project owner can delete the project');
    }

    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }

  async shareProject(userId: number, projectId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found or you're not the owner`);
    }

    // Генерируем новый код, если его нет или если владелец хочет обновить
    const shareCode = this.generateShareCode();
    return this.prisma.project.update({
      where: { id: projectId },
      data: { shareCode },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });
  }

  async getProjectByShareCode(shareCode: string) {
    const project = await this.prisma.project.findUnique({
      where: { shareCode },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        tasks: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async joinProject(userId: number, shareCode: string) {
    // Find project by share code
    const project = await this.prisma.project.findUnique({
      where: { shareCode },
      include: {
        sharedWith: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Invalid share code or project not found');
    }

    // Check if user is the owner
    if (project.ownerId === userId) {
      throw new BadRequestException('You cannot join your own project');
    }

    // Check if user is already in sharedWith
    const isAlreadyShared = project.sharedWith.some(share => share.userId === userId);
    if (isAlreadyShared) {
      throw new BadRequestException('You are already a member of this project');
    }

    // Add user to sharedWith
    return this.prisma.projectShare.create({
      data: {
        projectId: project.id,
        userId: userId,
      },
      include: {
        project: {
          include: {
            tasks: {
              include: {
                category: true,
              },
            },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }
} 