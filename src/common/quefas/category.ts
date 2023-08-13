import {
  PrismaClient,
  Category as PrismaCategory,
  Element as PrismaElement,
} from '@quefas/prisma-quefas';

export interface CategoryItem {
  id: string;
  name: string;
}

export class QuefasCategory {
  category: PrismaCategory;
  element: PrismaElement;
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  factory(category: PrismaCategory): CategoryItem {
    const item = {
      id: category.id,
      name: category.name,
    };
    return item;
  }

  async getByName(name: string): Promise<CategoryItem> {
    const category = await this.prisma.category.findUnique({
      where: {
        name: name,
      },
    });
    return this.factory(category);
  }
}
