import { FactoryModule } from './modules/factory/factory.module';
import { Module } from '@nestjs/common';
import { CoreModule } from './shared/core/core.modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { FactoryService } from './modules/factory/factory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factory } from './modules/factory/entities/factory.entity';
import { EmployeeModule } from './modules/employee/employee.module';
import { TechniquesModule } from './modules/techniques/techniques.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './db/seeds/seed.module';
import { FactoryLog } from './modules/factory/entities/factory-log.entity';
import { FactoryParams } from './modules/factory/entities/facory-param.entity';
import { Param } from './modules/factory/entities/param.entity';
import { SettingModule } from './modules/setting/setting.module';
@Module({
  imports: [
    CoreModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    FactoryModule,
    TypeOrmModule.forFeature([Factory, FactoryLog, FactoryParams, Param]),
    EmployeeModule,
    TechniquesModule,
    SettingModule,
    AuthModule,
    SeedModule,
  ],
  providers: [FactoryService],
  controllers: [AppController],
})
export class AppModule {}
