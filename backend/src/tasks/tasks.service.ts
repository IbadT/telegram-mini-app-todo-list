import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, projectId: number, createTaskDto: CreateTaskDto) {
    // Verify that the project belongs to the user
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
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
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate).toISOString() : null,
    };

    return this.prisma.task.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async findAll(userId: number, projectId: number) {
    // Verify that the project belongs to the user
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: number, projectId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        projectId,
        project: {
          userId,
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