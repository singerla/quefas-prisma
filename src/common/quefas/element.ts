import { Element as PrismaElement, PrismaClient } from '@prisma/client';
import { CategoryItem } from './category';
import { QuefasAspect } from './aspect';
import { QuefasAttribute } from './attribute';
import { JsonValue } from '@prisma/client/runtime/library';

export interface ElementItem {
  id: string;
  name: string;
  category: CategoryItem;
  params: JsonValue;
  setParam: (key: string, value: any) => ElementItem;
  updateParam: (key: string, value: any) => Promise<ElementItem>;
  update: () => Promise<ElementItem>;
  getParam: (key: string, defaultValue?: any) => any;
  updateAttribute: (
    aspect: string,
    value: any,
    name?: string
  ) => Promise<ElementItem>;
}

export class QuefasElement {
  aspect: QuefasAspect;
  attribute: QuefasAttribute;
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.aspect = new QuefasAspect(this.prisma);
    this.attribute = new QuefasAttribute(this.prisma);
  }

  factory(element: PrismaElement, category?: CategoryItem): ElementItem {
    const item: ElementItem = {
      id: element.id,
      name: element.name,
      params: element.params,
      category: category,
      updateAttribute: async (aspect: string, value: any, name?: string) => {
        await this.updateAttribute(aspect, value, item, name);
        return item;
      },
      setParam: (key: string, value: any) => {
        item.params[key] = value;
        return item;
      },
      updateParam: async (key: string, value: any) => {
        item.params[key] = value;
        await this.update(item, {
          params: item.params,
        });
        return item;
      },
      update: async () => {
        await this.update(item, {
          params: item.params,
        });
        return item;
      },
      getParam: (key: string, defaultValue?: any) => {
        return item.params[key] || defaultValue;
      },
    };

    return item;
  }

  async create(name: string, category: CategoryItem) {
    const element = await this.prisma.element.create({
      data: {
        name: name,
        categoryId: category.id,
      },
    });
    return this.factory(element, category);
  }

  async get(name: string) {
    const element = await this.prisma.element.findUnique({
      where: {
        name,
      },
    });
    return this.factory(element);
  }

  async getById(id: string) {
    const element = await this.prisma.element.findUnique({
      where: {
        id,
      },
    });
    return this.factory(element);
  }

  async updateAttribute(
    value: any,
    aspect: string,
    element: ElementItem,
    name?: string
  ) {
    const aspectItem = await this.aspect.getByName(aspect);
    const attribute = await this.attribute.create(aspectItem, value, name);

    await this.update(element, {
      attributes: {
        connect: {
          id: attribute.id,
        },
      },
    });
  }

  async update(element: ElementItem, data: any) {
    this.prisma.element.update({
      where: {
        id: element.id,
      },
      data: data,
    });
  }
}
