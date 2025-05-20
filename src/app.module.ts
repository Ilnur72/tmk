import { FactoryModule } from './modules/factory/factory.module';
import { Module } from '@nestjs/common';
import { CoreModule } from './shared/core/core.modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { FactoryService } from './modules/factory/factory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Factory,
  FactoryLog,
  FactoryParams,
} from './modules/factory/entities/factory.entity';
import { EmployeeModule } from './modules/employee/employee.module';
import { TechniquesModule } from './modules/techniques/techniques.module';
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [
    CoreModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    FactoryModule,
    TypeOrmModule.forFeature([Factory, FactoryLog, FactoryParams]),
    EmployeeModule,
    TechniquesModule,
    AuthModule,
  ],
  providers: [FactoryService],
  controllers: [AppController],
})
export class AppModule {}
