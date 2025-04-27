import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, projectId: number, createTaskDto: CreateTaskDto) {
    // Verify that the project belongs to the user or user has access through sharing
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } },
        ],
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Verify that the category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createTaskDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${createTaskDto.categoryId} not found`);
    }

    // Format the dueDate to ISO string if it exists
    const data = {
      ...createTaskDto,
      projectId,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
    };

    return this.prisma.task.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async findAll(userId: number, projectId: number) {
    // Verify that the project belongs to the user or user has access through sharing
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } },
        ],
      },
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

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found or you don't have access to it`);
    }

    console.log({ project });
    

    return project.tasks;
  }

  async findOne(userId: number, projectId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        projectId,
        project: {
          OR: [
            { ownerId: userId },
            { shares: { some: { userId } } },
          ],
        },
      },
      include: {
        category: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(userId: number, projectId: number, id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(userId, projectId, id);

    return this.prisma.task.update({
      where: {
        id,
      },
      data: updateTaskDto,
      include: {
        category: true,
      },
    });
  }

  async remove(userId: number, projectId: number, id: number) {
    await this.findOne(userId, projectId, id);

    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
} 