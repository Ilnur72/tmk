import { Controller, Get, Render } from '@nestjs/common';
import { FactoryService } from './modules/factory/factory.service';

@Controller()
export class AppController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get()
  @Render('factory/map')
  async home() {
    const factory = await this.factoryService.findAll();
    return {
      factory: factory.data,
    };
  }
}
