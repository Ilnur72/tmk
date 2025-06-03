import {
  Body,
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
  async findMarker(@Query('filters') query: { factory_param_id?: number }) {
    const factory = await this.factoryService.findAll(query);
    return factory.data;
  }
  @Get('log')
  async findFactoryLog(
    @Query('query') query: { paramId?: number; factoryId?: number },
  ) {
    const factory = await this.factoryService.findAllLog(query);
    return factory.data;
  }
  @Get('param/:id')
  async findOneFactoryParam(@Param('id') id: number) {
    const factoryParam = await this.factoryService.findOneFactoryParam(id);
    return factoryParam;
  }

  @Get()
  @Render('factory/index')
  async finAll() {
    const factories = await this.factoryService.findAll();
    return { factories: factories.data, total: factories.total };
  }

  @Get('update/:id')
  async updateModal(@Param('id') id: number, @Res() res: Response) {
    const factory = await this.factoryService.findOne(id);
    console.log(factory, 'factory');

    return res.render('partials/modal', { layout: false, factory: factory[0] });
  }

  // @Get('/update-param/:id')
  // async updateParamModal(@Param('id') id: number, @Res() res: Response) {
  //   const factory = await this.factoryService.findAll({
  //     filters: { factory_param_id: id },
  //   });
  //   return res.render('partials/factory/param-modal', {
  //     layout: false,
  //     factory,
  //   });
  // }

  @Get('/param-control/:id')
  async controlParamModal(@Param('id') id: number, @Res() res: Response) {
    const factory = await this.factoryService.findOne(id);

    return res.render('partials/param-modal', {
      layout: false,
      data: factory[0].factoryParams,
    });
  }

  @Put('param/update/:id')
  async updateParam(@Param('id') id: number, @Req() req: Request) {
    const result = await this.factoryService.updateParam(id, req.body);

    return { ok: true, status: result.status };
  }

  @Put('param-control/:id')
  @UseInterceptors(FileFieldsInterceptor([]))
  async updateFactoryParams(
    @Param('id') factoryId: number,
    @Req() req: Request,
  ) {
    return this.factoryService.updateFactoryParam(req.body.params);
  }

  @Put('update/:id')
  @UseInterceptors(FileFieldsInterceptor([]))
  async update(@Param('id') id: number, @Req() req: Request) {
    await this.factoryService.update(id, req.body);
    return;
  }

  @Post('log')
  async updateFactoryLog(@Req() req: Request) {
    const data = await this.factoryService.addFactoryLog(req.body);
    return { ok: true, data };
  }
}
