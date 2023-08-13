import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PrismaClient as PrismaClientUser,
  Project,
} from '@quefas/prisma-projects';
import { PrismaClient } from '@quefas/prisma-quefas';

/**
 * PrismaServiceProject creates a new PrismaClient instance for each project.
 * Projects have an ID which is passed with each request. Whenever there is no
 * PrismaClient for a given ID, this class will return a new PrismaClient.
 *
 * This makes it possible to use one schema (project.mysql.prisma) for many
 * different databases (multi-tennant).
 */
@Injectable()
export class PrismaServiceQuefas implements OnModuleDestroy {
  private clients: { [key: string]: PrismaClient } = {};
  private projects: { [key: string]: Project } = {};
  private defaultClient: PrismaClient;

  async getClient(
    projectId: string,
    config: ConfigService,
    userClient: PrismaClientUser
  ): Promise<PrismaClient> {
    if (!projectId) {
      if (!this.defaultClient) {
        this.defaultClient = new PrismaClient();
      }
      return this.defaultClient;
    }

    const project = await this.getProjectData(projectId, userClient).catch(
      (e) => {
        throw e;
      }
    );

    let client = this.clients[project.id];

    if (!client) {
      const db = config
        .get('databases')
        .find((database) => database.key === project.db);
      client = new PrismaClient({
        datasources: {
          db: {
            url: db.url + project.schema,
          },
        },
      });
      this.clients[project.id] = client;
    }

    return client;
  }

  async getProjectData(
    projectId: string,
    userClient: PrismaClientUser
  ): Promise<Project> {
    if (!this.projects[projectId]) {
      this.projects[projectId] = await userClient.project.findUnique({
        where: {
          id: projectId,
        },
      });
    }

    const project = this.projects[projectId];

    if (!project) {
      throw '' + 'Could not resolve project data for projectId: ' + projectId;
    }

    return project;
  }

  async onModuleDestroy() {
    await Promise.all(
      Object.values(this.clients).map((client) => client.$disconnect())
    );
  }
}
