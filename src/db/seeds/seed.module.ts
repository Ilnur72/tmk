import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Employee } from '../../modules/employee/entities/employee.entity';
import { FactoryLog } from '../../modules/factory/entities/factory-log.entity';
import { Factory } from '../../modules/factory/entities/factory.entity';
import { FactoryParams } from '../../modules/factory/entities/facory-param.entity';
import { Cars } from '../../modules/techniques/entities/technique.entity';
import { Param } from '../../modules/factory/entities/param.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Factory,
      FactoryLog,
      FactoryParams,
      Cars,
      Param,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
