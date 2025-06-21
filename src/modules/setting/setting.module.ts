import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Param } from '../factory/entities/param.entity';
import { Factory } from '../factory/entities/factory.entity';
import { FactoryParams } from '../factory/entities/facory-param.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Param, Factory, FactoryParams])],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
