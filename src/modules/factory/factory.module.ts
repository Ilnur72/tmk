import { Module } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { FactoryController } from './factory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factory } from './entities/factory.entity';
import { FactoryLog } from './entities/factory-log.entity';
import { FactoryParams } from './entities/facory-param.entity';
import { Param } from './entities/param.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Factory, FactoryLog, FactoryParams, Param]),
  ],
  controllers: [FactoryController],
  providers: [FactoryService],
})
export class FactoryModule {}
