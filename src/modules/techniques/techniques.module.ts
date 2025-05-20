import { Module } from '@nestjs/common';
import { TechniquesService } from './techniques.service';
import { TechniquesController } from './techniques.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from './entities/technique.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cars])],
  controllers: [TechniquesController],
  providers: [TechniquesService],
})
export class TechniquesModule {}
