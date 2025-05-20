import { NestFactory } from '@nestjs/core';
import { SeedService } from '../db/seeds/seed.service';
import { AppModule } from '../app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  try {
    await seedService.seed();
    console.log('Seeds completed successfully');
  } catch (error) {
    console.error(error);
  } finally {
    await app.close();
  }
}

bootstrap();
