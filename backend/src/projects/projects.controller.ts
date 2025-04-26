import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: RequestWithUser) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  findAll(@Req() req: RequestWithUser) {
    return this.projectsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Return the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.projectsService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: RequestWithUser,
  ) {
    return this.projectsService.update(+id, updateProjectDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.projectsService.remove(+id, req.user.id);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Generate or get share code for a project' })
  @ApiResponse({ status: 200, description: 'Share code generated or retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  generateShareCode(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.projectsService.generateShareCode(+id, req.user.id);
  }

  @Get('share/:code')
  @ApiOperation({ summary: 'Get project by share code' })
  @ApiResponse({ status: 200, description: 'Return the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  getProjectByShareCode(@Param('code') code: string) {
    return this.projectsService.getProjectByShareCode(code);
  }

  @Post('join/:shareCode')
  @ApiOperation({ summary: 'Join a project using share code' })
  @ApiResponse({ status: 200, description: 'Successfully joined the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  joinProject(@Param('shareCode') shareCode: string, @Req() req: RequestWithUser) {
    return this.projectsService.joinProject(shareCode, req.user.id);
  }
} 