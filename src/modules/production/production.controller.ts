import { Controller, Get, Render } from '@nestjs/common';
import { ProductionService } from './production.service';

@Controller('production')
export class ProductionController {
  constructor(private readonly ProductionService: ProductionService) {}

  // @Get()
  // @Render('Production')
  // async getHome() {
  //   const locations = await this.ProductionService.getAll();
  //   return {
  //     locations: JSON.stringify(locations),
  //     parsedLocations: locations,
  //   };
  // }

  @Get()
  @Render('proccess')
  root() {
    return {};
  }
}
