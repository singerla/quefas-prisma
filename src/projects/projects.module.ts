import { Module } from '@nestjs/common';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { UsersModule } from '../users/users.module';
import { PrismaClient as PrismaClientProjects } from '@quefas/prisma-projects';

@Module({
  imports: [UsersModule],
  providers: [PrismaClientProjects, ProjectsService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}
