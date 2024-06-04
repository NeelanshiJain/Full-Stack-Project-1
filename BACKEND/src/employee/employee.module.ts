import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { ProjectModule } from 'src/project/project.module';
import { EmployeeUpdateLog } from './entities/employee-update-log.entity';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee,EmployeeUpdateLog]),ProjectModule,RedisModule],
  providers: [EmployeeService, EmployeeResolver]
})
export class EmployeeModule {}
