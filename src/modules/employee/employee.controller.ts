import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import axios from 'axios';

@Controller('employers')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @Render('employee/index')
  findAll(@Query() query: any) {
    const result = this.employeeService.findAll(query);
    return { message: result };
  }

  @Get('branches')
  @Render('employee/branches')
  async findAllBranch(@Query() query: any) {
    const result = await axios.get(
      'http://84.54.118.39:8444/1c/tashkilot-statistika/',
    );
    return { branches: result.data };
  }

  @Get('/online')
  @Render('employee/employers')
  findAllEmployers(@Query() query: any) {
    const result = this.employeeService.findAll(query);
    return { message: result };
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.employeeService.remove(+id);
  }
}
