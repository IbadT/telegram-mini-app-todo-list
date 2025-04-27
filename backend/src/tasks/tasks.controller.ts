import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('tasks')
// @ApiBearerAuth()
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  create(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const userId = req.user?.id;
    console.log({ toCreate: {userId, projectId, createTaskDto} });
    
    return this.tasksService.create(userId, +projectId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  findAll(@Param('projectId') projectId: string, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user?.id;
    console.log({ userId, projectId });
    
    return this.tasksService.findAll(userId, +projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const userId = req.user?.id;
    return this.tasksService.findOne(userId, +projectId, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const userId = req.user?.id;
    return this.tasksService.update(userId, +projectId, +id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const userId = req.user?.id;
    return this.tasksService.remove(userId, +projectId, +id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle task completion status' })
  @ApiResponse({ status: 200, description: 'Task status toggled successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  toggle(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const userId = req.user?.id;
    return this.tasksService.toggle(userId, +projectId, +id);
  }
} 