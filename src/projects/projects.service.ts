import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma, PrismaClient, Project } from '@quefas/prisma-projects';
import { ProjectInput } from './dto/project.input';
import { ID } from '../common/models/base.model';
import { PrismaClient as PrismaClientProjects } from '@quefas/prisma-projects';

export type ClientType = Prisma.Prisma__ProjectClient<Project & {}>;

@Injectable()
export class ProjectsService extends DatabaseService<ClientType, PrismaClient> {
  constructor(protected readonly prisma: PrismaClientProjects) {
    super(prisma, 'project');
  }

  async createProject(data: ProjectInput) {
    let project = await this.find({
      name: data.name,
    });

    if (!project) {
      project = await this.create(data);
    }

    if (project.id) {
      return project;
    }
  }

  async updateProject(id: ID, data: ProjectInput) {
    const project = await this.findOne(id);

    if (project.id) {
      return this.update(id, data);
    }

    return project;
  }

  async dropProject(id: ID) {
    const project = await this.findOne(id);

    if (project.id) {
      return this.delete(id);
    }

    return project;
  }
}
