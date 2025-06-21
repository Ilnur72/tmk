import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @Render('setting/index')
  async findMap() {
    const parameters = await this.settingService.findParam();
    return { parameters };
  }

  @Post('param')
  @UseInterceptors(FileFieldsInterceptor([]))
  async createParam(@Req() req: Request) {
    try {
      const data = await this.settingService.addParam(req.body);
      return { ok: true, data };
    } catch (error) {
      throw error;
    }
  }

  @Delete('param/:id')
  async deleteParam(@Param('id') id: number) {
    await this.settingService.deleteParam(id);
    return { ok: true };
  }
}
