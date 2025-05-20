import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Render,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FactoryService } from './factory.service';
import { Request, Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get('/map')
  @Render('factory/map')
  async findMap() {
    const factory = await this.factoryService.findAll();

    return {
      factory,
    };
  }

  @Get('marker')
  async findMarker() {
    const factory = await this.factoryService.findAll();
    return factory.data;
  }
  @Get('log')
  async findFactoryLog(
    @Query('query') query: { paramId?: number; factoryId?: number },
  ) {
    const factory = await this.factoryService.findAllLog(query);
    return factory.data;
  }

  @Get()
  @Render('factory/index')
  async finAll() {
    const factories = await this.factoryService.findAll();
    console.log(factories.data[1]);

    return { factories: factories.data };
  }

  @Get('update/:id')
  // @Render('partials/modal')
  async updateModal(@Param('id') id: number, @Res() res: Response) {
    const factory = await this.factoryService.findOne(id);

    return res.render('partials/modal', { layout: false, factory });
  }

  @Get('/update-param/:id')
  // @Render('partials/modal')
  async updateParamModal(@Param('id') id: number, @Res() res: Response) {
    const factory = await this.factoryService.findAll({
      filters: { factory_param_id: id },
    });

    // return { data: factory.data[0].factoryParams };
    return res.render('partials/param-modal', { layout: false, factory });
  }

  @Put('param/update/:id')
  async updateParam(@Param('id') id: number, @Req() req: Request) {
    const result = await this.factoryService.updateParam(id, req.body);

    return { ok: true, status: result.status };
  }

  @Put('update/:id')
  @UseInterceptors(FileFieldsInterceptor([]))
  async update(@Param('id') id: number, @Req() req: Request) {
    await this.factoryService.update(id, req.body);
    return;
  }

  @Post('log')
  async updateFactoryLog(@Req() req: Request) {
    await this.factoryService.addFactoryLog(req.body);
    return { ok: true };
  }
}
