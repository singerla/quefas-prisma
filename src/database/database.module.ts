import {
  FactoryProvider,
  Global,
  HttpException,
  HttpStatus,
  Module,
} from '@nestjs/common';
import { CookiesService } from '../common/cookies/cookies.service';
import { PrismaServiceQuefas } from './prisma.service.quefas';
import { PrismaServiceProject } from './prisma.service.project';
import { ConfigService } from '@nestjs/config';
import { CookiesModule } from '../common/cookies/cookies.module';
import { PrismaClient as PrismaClientUser } from '@quefas/prisma-projects';
import { PrismaClient as PrismaClientProject } from '@quefas/prisma-quefas';

const prismaUserProvider = {
  provide: PrismaClientUser,
  useClass: PrismaServiceProject,
};

const prismaClientProvider: FactoryProvider<Promise<PrismaClientProject>> = {
  provide: PrismaClientProject,
  inject: [
    PrismaServiceQuefas,
    CookiesService,
    PrismaClientUser,
    ConfigService,
  ],
  useFactory: async (
    manager: PrismaServiceQuefas,
    cookies: CookiesService,
    userClient: PrismaClientUser,
    config: ConfigService
  ) => {
    const projectId = cookies.getActiveProjectId();

    return manager.getClient(projectId, config, userClient);
  },
};

@Global()
@Module({
  imports: [CookiesModule],
  providers: [
    PrismaClientUser,
    PrismaServiceQuefas,
    prismaClientProvider,
    prismaUserProvider,
  ],
  exports: [PrismaServiceQuefas, PrismaClientUser, PrismaClientProject],
})
export class DatabaseModule {}
