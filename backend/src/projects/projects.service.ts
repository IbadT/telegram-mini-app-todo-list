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

  async generateShareCode(id: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (!project.shareCode) {
      const shareCode = randomBytes(4).toString('hex');
      await this.prisma.project.update({
        where: { id },
        data: { shareCode },
      });
      return { shareCode };
    }

    return { shareCode: project.shareCode };
  }

  async joinProject(shareCode: string, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { shareCode },
      include: {
        shares: true,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.ownerId === userId) {
      throw new Error('You are already the owner of this project');
    }

    if (project.shares.some(share => share.userId === userId)) {
      throw new Error('You have already joined this project');
    }

    await this.prisma.projectShare.create({
      data: {
        projectId: project.id,
        userId,
      },
    });

    return this.prisma.project.findUnique({
      where: { id: project.id },
      include: {
        tasks: true,
        shares: true,
      },
    });
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