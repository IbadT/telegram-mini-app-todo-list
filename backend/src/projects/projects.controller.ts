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
  // UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ShareProjectDto } from './dto/share-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('projects')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  create(@Req() req: Request, @Body() createProjectDto: CreateProjectDto) {
    const initData = req.headers['tg-init-data'];
    console.log('Telegram init data:', initData);
    
    // TODO: Replace with actual user ID from auth
    const userId = 1;
    return this.projectsService.create(userId, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  findAll(@Req() req: Request) {
    const initData = req.headers['tg-init-data'];
    console.log('Telegram init data:', initData);
    
    // TODO: Replace with actual user ID from auth
    const userId = 1;
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Return the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findOne(@Req() req: Request, @Param('id') id: string) {
    const initData = req.headers['tg-init-data'];
    console.log('Telegram init data:', initData);
    
    // TODO: Replace with actual user ID from auth
    const userId = 1;
    return this.projectsService.findOne(userId, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateProjectDto: any) {
    const initData = req.headers['tg-init-data'];
    console.log('Telegram init data:', initData);
    
    // TODO: Replace with actual user ID from auth
    const userId = 1;
    return this.projectsService.update(userId, +id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  remove(@Req() req: Request, @Param('id') id: string) {
    const initData = req.headers['tg-init-data'];
    console.log('Telegram init data:', initData);
    
    // TODO: Replace with actual user ID from auth
    const userId = 1;
    return this.projectsService.remove(userId, +id);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Generate or get share code for a project' })
  @ApiResponse({ status: 200, description: 'Share code generated or retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  shareProject(@Req() req: Request, @Param('id') id: string) {
    const initData = req.headers['tg-init-data'];
    console.log('Telegram init data:', initData);
    
    // TODO: Replace with actual user ID from auth
    const userId = 1;
    return this.projectsService.shareProject(userId, +id);
  }

  @Get('share/:code')
  @ApiOperation({ summary: 'Get project by share code' })
  @ApiResponse({ status: 200, description: 'Return the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  getProjectByShareCode(@Param('code') code: string) {
    return this.projectsService.getProjectByShareCode(code);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a project using share code' })
  @ApiResponse({ status: 200, description: 'Successfully joined the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  joinProject(@Req() req: Request, @Body() shareProjectDto: ShareProjectDto) {
    const initData = req.headers['tg-init-data'];
    console.log('Telegram init data:', initData);
    
    // TODO: Replace with actual user ID from auth
    const userId = 1;
    return this.projectsService.joinProject(userId, shareProjectDto.shareCode);
  }
} 