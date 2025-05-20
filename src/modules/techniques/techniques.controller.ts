import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
} from '@nestjs/common';
import { TechniquesService } from './techniques.service';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { UpdateTechniqueDto } from './dto/update-technique.dto';

@Controller('techniques')
export class TechniquesController {
  constructor(private readonly techniquesService: TechniquesService) {}

  @Post()
  create(@Body() createTechniqueDto: CreateTechniqueDto) {
    return this.techniquesService.create(createTechniqueDto);
  }

  @Get()
  @Render('techniques/index')
  findAll() {
    const result = this.techniquesService.findAll();
    return { techniques: result };
  }

  @Get('marker')
  async findAllMarker(): Promise<any> {
    const result = await this.techniquesService.findAll();
    return result.data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techniquesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTechniqueDto: UpdateTechniqueDto,
  ) {
    return this.techniquesService.update(+id, updateTechniqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techniquesService.remove(+id);
  }
}
