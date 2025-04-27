import { Injectable, NotFoundException, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { randomBytes } from 'crypto';
import { User } from '@prisma/client';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  // public generateShareCode(): string {
  //   // Генерируем более удобный для пользователей код
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //   let result = '';
  //   for (let i = 0; i < 6; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // }

  async create(createProjectDto: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        ownerId: userId,
      },
      include: {
        tasks: true,
        shares: true,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } },
        ],
      },
      include: {
        tasks: true,
        shares: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    return this.prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } },
        ],
      },
      include: {
        tasks: true,
        shares: true,
      },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number) {
    return this.prisma.project.update({
      where: {
        id,
        ownerId: userId,
      },
      data: updateProjectDto,
      include: {
        tasks: true,
        shares: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    return this.prisma.project.delete({
      where: {
        id,
        ownerId: userId,
      },
    });
  }

  async generateShareCode(projectId: number, userId: number) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');
    if (project.ownerId !== userId) throw new Error('Not your project');

    if (project.shareCode) return { shareCode: project.shareCode };

    // Генерируем уникальный короткий код
    let shareCode;
    let isUnique = false;
    while (!isUnique) {
      shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await this.prisma.project.findUnique({ where: { shareCode } });
      if (!existing) isUnique = true;
    }
    await this.prisma.project.update({
      where: { id: projectId },
      data: { shareCode },
    });
    return { shareCode };
  }

  async joinProject(shareCode: string, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { shareCode },
      include: { 
        shares: true,
        tasks: {
          include: {
            category: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });
    if (!project) throw new Error('Project not found');
    if (project.ownerId === userId) throw new Error('You are the owner of this project');
    if (project.shares.some(share => share.userId === userId)) throw new Error('You have already joined this project');

    await this.prisma.projectShare.create({
      data: { projectId: project.id, userId },
    });

    return { 
      message: 'Successfully joined the project', 
      projectId: project.id,
      project: {
        ...project,
        tasks: project.tasks
      }
    };
  }

  async getProjectByShareCode(code: string) {
    return this.prisma.project.findUnique({
      where: { shareCode: code },
      include: {
        tasks: true,
        shares: true,
      },
    });
  }
} 