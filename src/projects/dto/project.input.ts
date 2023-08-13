import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class ProjectInput {
  @Field()
  @MaxLength(255)
  name: string;

  @Field()
  @MaxLength(64)
  key: string;

  @Field()
  @MaxLength(255)
  db: string;

  @Field()
  @MaxLength(255)
  schema: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  icon?: string;
}
