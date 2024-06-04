
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string
  @Column()
  lastName: string
  @Column()
  email: string
  @Column()
  password: string
  @Column()
  role: string
}