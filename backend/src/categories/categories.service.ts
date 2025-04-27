import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    // Проверяем, что проект существует и принадлежит пользователю
    const project = await this.prisma.project.findFirst({
      where: {
        id: createCategoryDto.projectId,
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } }
        ]
      }
    });
    if (!project) {
      throw new NotFoundException('Project not found or not accessible');
    }

    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        color: createCategoryDto.color,
        project: {
          connect: { id: createCategoryDto.projectId }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }
} 