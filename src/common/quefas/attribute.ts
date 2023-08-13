import {
  PrismaClient,
  Attribute as PrismaAttribute,
} from '@quefas/prisma-quefas';
import { AspectItem } from './aspect';
import { ElementItem } from './element';

export interface AttributeItem {
  id: string;
  name: string;
  value: string;
  aspect: AspectItem;
  element: ElementItem;
}

export class QuefasAttribute {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  factory(
    attribute: PrismaAttribute,
    aspect: AspectItem,
    element?: ElementItem
  ): AttributeItem {
    const item = {
      id: attribute.id,
      name: attribute.name,
      value: attribute.string,
      aspect: aspect,
      element: element,
    };
    return item;
  }

  async create(aspect: AspectItem, value: string, name?: string) {
    const attribute = await this.prisma.attribute.create({
      data: {
        aspectId: aspect.id,
        string: value,
        name: name,
      },
    });
    return this.factory(attribute, aspect);
  }

  async getByAspect(
    aspect: AspectItem,
    element: ElementItem
  ): Promise<AttributeItem[]> {
    const attributes = await this.prisma.attribute.findMany({
      where: {
        aspectId: aspect.id,
        AND: {
          elements: {
            some: {
              id: element.id,
            },
          },
        },
      },
    });

    const items = [];
    attributes.forEach((attribute) => {
      items.push(this.factory(attribute, aspect, element));
    });

    return items;
  }
}
