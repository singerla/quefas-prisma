import { Injectable } from '@nestjs/common';
import { ID } from '../common/models/base.model';
import { IDatabaseService } from './database.interface';

export type Options = {
  orderBy: any;
};

@Injectable()
export class DatabaseService<T, U> implements IDatabaseService<T> {
  model: any;

  protected constructor(
    protected prisma: any,
    protected modelName: string,
    protected options?: Options
  ) {
    this.model = this.prisma[this.modelName];
    this.options = options;
  }

  findOne(id: ID, include?): T {
    return this.model.findUnique({
      where: {
        id: id,
      },
      include: include,
    });
  }

  find(where?, include?): T {
    return this.model.findUnique({
      where: where,
      include: include,
    });
  }

  findMany(where?, orderBy?): T {
    return this.model.findMany({
      where: where,
      orderBy: orderBy || this.options?.orderBy,
    });
  }

  create(data): T {
    return this.model.create({
      data: data,
    });
  }

  update(id: ID, data, include?): T {
    return this.model.update({
      where: {
        id: id,
      },
      data: data,
      include: include,
    });
  }

  updateMany(ids: ID[], data): T {
    return this.model.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: data,
    });
  }

  connect(id: ID, connectIds: ID[], field: string): T {
    return this.setConnections('connect', id, connectIds, field);
  }

  disconnect(id: ID, connectIds: ID[], field: string): T {
    return this.setConnections('disconnect', id, connectIds, field);
  }

  private setConnections(
    mode: 'connect' | 'disconnect',
    id: ID,
    connectIds: ID[],
    field: string
  ): T {
    const mapIds = connectIds.map((connectId) => {
      return {
        id: connectId,
      };
    });
    return this.update(id, {
      [field]: {
        [mode]: mapIds,
      },
    });
  }

  delete(id: ID): T {
    return this.model.delete({
      where: {
        id: id,
      },
    });
  }
}
