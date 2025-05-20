import { Module } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { FactoryController } from './factory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Factory,
  FactoryLog,
  FactoryParams,
  Param,
} from './entities/factory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Factory, FactoryLog, FactoryParams, Param]),
  ],
  controllers: [FactoryController],
  providers: [FactoryService],
})
export class FactoryModule {}
