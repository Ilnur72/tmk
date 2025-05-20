import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configService from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../utils/typeorm-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configService],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class CoreModule {}
