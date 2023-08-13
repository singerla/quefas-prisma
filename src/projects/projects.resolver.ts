import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectInput } from './dto/project.input';
import { Project } from './models/project.model';
import { PrismaClient as PrismaClientProjects } from '@quefas/prisma-projects';
import { ProjectsService } from './projects.service';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(
    protected prisma: PrismaClientProjects,
    private service: ProjectsService
  ) {}

  @Query(() => [Project])
  allProjects() {
    return this.service.findMany();
  }

  @Query(() => Project)
  projectById(@Args('id') projectId: string) {
    return this.service.findOne(projectId);
  }

  @Mutation(() => Project)
  async createProject(@Args('data') data: ProjectInput) {
    return this.service.createProject(data);
  }

  @Mutation(() => Project)
  async updateProject(
    @Args('id') projectId: string,
    @Args('data') data: ProjectInput
  ) {
    return this.service.updateProject(projectId, data);
  }

  @Mutation(() => Project)
  async dropProject(@Args('id') projectId: string) {
    return this.service.dropProject(projectId);
  }
}
