import { PrismaClient } from '@quefas/prisma-quefas';
import { QuefasElement } from './element';
import { QuefasCategory } from './category';

export class Quefas {
  prisma: PrismaClient;
  category: QuefasCategory;
  element: QuefasElement;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;

    this.category = new QuefasCategory(this.prisma);
    this.element = new QuefasElement(this.prisma);
  }

  async getElement(name: string) {
    return this.element.get(name);
  }

  async getElementById(id: string) {
    return this.element.getById(id);
  }

  async createElement(name: string, categoryName: string) {
    const category = await this.category.getByName(categoryName);
    const element = await this.element.create(name, category);

    return element;
  }
}
