import { PrismaClient, Aspect as PrismaAspect } from '@quefas/prisma-quefas';

export interface AspectItem {
  id: string;
  name: string;
}

export class QuefasAspect {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  factory(aspect: PrismaAspect): AspectItem {
    const item = {
      id: aspect.id,
      name: aspect.name,
    };
    return item;
  }

  async getByName(name: string): Promise<AspectItem> {
    const aspect = await this.prisma.aspect.findUnique({
      where: {
        name: name,
      },
    });
    return this.factory(aspect);
  }
}
