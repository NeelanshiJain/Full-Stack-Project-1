import { Field, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class EmployeeUpdateLog {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  employeeId: number;

  @Field()
  @Column()
  updatedAt: Date;

  @Field()
  @Column()
  updatedBy: number;

  @Field(() => GraphQLJSON, { nullable: true }) 
  @Column({ type: 'jsonb', nullable: true }) 
  changes: Record<string, { old: any, new: any }>;
}
