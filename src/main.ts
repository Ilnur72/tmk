import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { registerHelpers } from './shared/utils/handlebars-helpers';
import hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.useStaticAssets(join(__dirname, '..', 'src/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  hbs.registerPartials(join(__dirname, '..', 'src', 'views', 'partials'));
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'layouts/main-layout' });
  hbs.registerHelper('eq', function (a, b) {
    return a == b;
  });
  hbs.registerHelper('ne', function (a, b) {
    return a !== b;
  });
  hbs.registerHelper('and', function (...args) {
    // Oxirgi argument options obyekti
    const options = args.pop();
    // Barcha argumentlarni tekshirish
    const allTruthy = args.every((arg) => !!arg);

    // Agar block helper bo'lsa ({{#and}})
    if (options && typeof options.fn === 'function') {
      return allTruthy ? options.fn(this) : options.inverse(this);
    }
    // Oddiy helper bo'lsa ({{and a b}})
    return allTruthy;
  });
  registerHelpers();
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
