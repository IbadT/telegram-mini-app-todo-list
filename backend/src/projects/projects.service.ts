import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

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
          userId: userId,
        },
      });

      if (existingProject) {
        throw new BadRequestException(`Project with name "${createProjectDto.name}" already exists`);
      }

      return this.prisma.project.create({
        data: {
          ...createProjectDto,
          userId,
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
    return this.prisma.project.findMany({
      where: {
        userId,
      },
      include: {
        tasks: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findOne(userId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        userId,
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
    await this.findOne(userId, id);

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
    await this.findOne(userId, id);

    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
} 