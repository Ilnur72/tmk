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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FactoryService } from './factory.service';
import { Request, Response } from 'express';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

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

  @Get('all')
  async finFiltered(@Query('status') status?: string) {
    const factories = await this.factoryService.findAll({ status: status });
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
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      // maksimum 10 ta rasm
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/factory-images';
          // Papka mavjud emasligini tekshirish va yaratish
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          cb(null, `factory-${uniqueSuffix}${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Faqat rasm fayllarini qabul qilish
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Faqat rasm fayllari ruxsat etilgan!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async createFactory(
    @Req() req: Request,
    @UploadedFiles() images: MulterFile[],
  ) {
    const imagePaths = images ? images.map((img) => img.filename) : [];

    await this.factoryService.addFactory({
      ...req.body,
      images: imagePaths,
    });

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

    return { ok: true, data: result };
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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/factory-images';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          cb(null, `factory-${uniqueSuffix}${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async update(
    @Param('id') id: number,
    @UploadedFiles() files: { images?: MulterFile[] },
    @Req() req: Request,
  ) {
    const imagePaths = files?.images?.map((img) => img.filename) || [];
    const updateData = {
      ...req.body,
      ...(imagePaths.length > 0 && { images: imagePaths }),
    };

    await this.factoryService.update(id, updateData);
    return { ok: true, status: 'success' };
  }

  @Post('log')
  async updateFactoryLog(@Req() req: Request) {
    const data = await this.factoryService.addFactoryLog(req.body);
    return { ok: true, data };
  }
}
