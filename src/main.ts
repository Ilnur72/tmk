import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { registerHelpers } from './shared/utils/handlebars-helpers';
import hbs from 'hbs';
import { NotFoundFilter } from './shared/filters/not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'src/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  hbs.registerPartials(join(__dirname, '..', 'src', 'views', 'partials'));
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'layouts/main-layout' });
  registerHelpers();

  app.useGlobalFilters(new NotFoundFilter());

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
