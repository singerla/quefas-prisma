import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';

@ObjectType({ description: 'Project' })
export class Project extends BaseModel {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  key: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  params?: string;

  @Field({ nullable: true })
  db?: string;

  @Field({ nullable: true })
  schema?: string;
}
