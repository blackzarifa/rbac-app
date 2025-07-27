import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';
import { IsNotEmpty, MaxLength } from 'class-validator';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @IsNotEmpty({ message: 'Project name is required' })
  @MaxLength(255, { message: 'Project name must not exceed 255 characters' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Column()
  createdById: number;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
