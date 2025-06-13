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
  async findMarker(@Query('filters') query: { factory_param_id?: number }) {
    const factory = await this.factoryService.findAll(query);
    return factory.data;
  }

  @Get('log')
  async findFactoryLog(
    @Query('query')
    query: {
      paramId?: number;
      factoryId?: number;
      factoryParamId?: number;
    },
  ) {
    const factory = await this.factoryService.findAllLog(query);
    return factory.data;
  }

  @Get('log-history')
  async findFactoryLogHistory(
    @Query('query')
    query: {
      factoryParamId?: number;
    },
    @Res() res: Response,
  ) {
    const factory = await this.factoryService.findAllLog(query);
    return res.render('partials/factory/history-comment', {
      layout: false,
      data: factory.data,
    });
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
    return {
      factories: factories.data,
      total: factories.total,
      counts: factories.counts,
    };
  }

  @Get('update/:id')
  async updateModal(@Param('id') id: number, @Res() res: Response) {
    const factory = await this.factoryService.findOne(id);
    return res.render('partials/factory/modal', {
      layout: false,
      factory: factory[0],
    });
  }

  @Get('create')
  async createFactoryModal(@Param('id') id: number, @Res() res: Response) {
    return res.render('partials/factory/create-factory', {
      layout: false,
    });
  }

  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([]))
  async createFactory(@Req() req: Request) {
    console.log(req.body, 'req.body');
    await this.factoryService.addFactory(req.body);

    return { ok: true, status: 'success' };
  }

  // @Get('/update-param/:id')
  // async updateParamModal(@Param('id') id: number, @Res() res: Response) {
  //   const factory = await this.factoryService.findAll({
  //     filters: { factory_param_id: id },
  //   });
  //   return res.render('partials/factory/factory/param-modal', {
  //     layout: false,
  //     factory,
  //   });
  // }

  @Get('/param-control/:id')
  async controlParamModal(@Param('id') id: number, @Res() res: Response) {
    const factory = await this.factoryService.findOne(id);

    return res.render('partials/factory/param-modal', {
      layout: false,
      data: factory[0].factoryParams,
    });
  }

  @Put('param/update/:id')
  async updateParam(@Param('id') id: number, @Req() req: Request) {
    const result = await this.factoryService.updateParam(id, req.body);

    return { ok: true };
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
