import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectMeta, CanvasState } from '@canvascloud/shared';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProjectMeta[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return projects.map((p) => {
      let canvas: CanvasState = { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } };
      try {
        canvas = JSON.parse(p.canvas) as CanvasState;
      } catch {
        // Fallback for malformed records
      }
      return {
        id: p.id,
        name: p.name,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        nodeCount: canvas.nodes?.length || 0,
        edgeCount: canvas.edges?.length || 0,
      };
    });
  }

  async findOne(id: string): Promise<Project> {
    try {
      const project = await this.prisma.project.findUniqueOrThrow({
        where: { id },
      });
      let parsedCanvas: CanvasState = {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      };
      try {
        parsedCanvas = JSON.parse(project.canvas) as CanvasState;
      } catch {
        // Fallback
      }
      return {
        id: project.id,
        name: project.name,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        canvas: parsedCanvas,
        nodeCount: parsedCanvas.nodes?.length || 0,
        edgeCount: parsedCanvas.edges?.length || 0,
      };
    } catch {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        canvas: JSON.stringify(dto.canvas),
      },
    });
    return this.findOne(project.id);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    try {
      await this.prisma.project.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.canvas && { canvas: JSON.stringify(dto.canvas) }),
        },
      });
      return this.findOne(id);
    } catch {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.project.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
}
