import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from './config/database.config';
import { seedRoles } from './database/seed-roles';
import { seedUsers } from './database/seed-users';
import { HealthController } from './health.controller';
import { AuthModule } from './modules/auth.module';
import { ProjectModule } from './modules/project.module';
import { TaskModule } from './modules/task.module';
import { UserModule } from './modules/user.module';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Role, Project, Task]),
    AuthModule,
    ProjectModule,
    TaskModule,
    UserModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await seedRoles(this.dataSource);
    await seedUsers(this.dataSource);
  }
}
