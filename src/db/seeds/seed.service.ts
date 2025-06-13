import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { Employee } from '../../modules/employee/entities/employee.entity';
import { Factory } from '../../modules/factory/entities/factory.entity';
import { FactoryParams } from '../../modules/factory/entities/facory-param.entity';
import { Param } from '../../modules/factory/entities/param.entity';
import { Cars } from '../../modules/techniques/entities/technique.entity';
import factoryData from '../data/factory.json';
import factoryParamsData from '../data/factory_params.json';
import factoryLogsData from '../data/factory_log.json';
import carsData from '../data/cars.json';
import paramsData from '../data/params.json';
import { FactoryLog } from '../../modules/factory/entities/factory-log.entity';
@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
    @InjectRepository(FactoryParams)
    private readonly factoryParamsRepository: Repository<FactoryParams>,
    @InjectRepository(FactoryLog)
    private readonly factoryLogRepository: Repository<FactoryLog>,
    @InjectRepository(Param)
    private readonly paramsRepository: Repository<Param>,
    @InjectRepository(Cars)
    private readonly carsRepository: Repository<Cars>,
  ) {}

  async seed() {
    await this.seedAdmin();
    await this.seedFactory();
    await this.seedParams();
    await this.seedFactoryParams();
    await this.seedFactoryLog();
    await this.seedCars();
  }

  private async seedFactory() {
    const result = this.factoryRepository.create(factoryData);
    await this.factoryRepository.save(result);
  }

  private async seedParams() {
    const result = this.paramsRepository.create(paramsData);
    await this.paramsRepository.save(result);
  }
  private async seedFactoryParams() {
    const result = this.factoryParamsRepository.create(factoryParamsData);
    await this.factoryParamsRepository.save(result);
  }
  private async seedFactoryLog() {
    const result = this.factoryLogRepository.create(factoryLogsData);
    await this.factoryLogRepository.save(result);
  }
  private async seedCars() {
    const result = this.carsRepository.create(carsData);
    await this.carsRepository.save(result);
  }

  private async seedAdmin() {
    const hashedPassword: string = await hash(
      process.env.SYSTEM_ADMIN_PASSWORD,
      10,
    );
    const employeePassword: string = await hash('employee1234', 10);
    const user = await this.employeeRepository.findOneBy({
      email: process.env.SYSTEM_ADMIN_EMAIL,
    });
    if (user) await this.employeeRepository.delete(user.id);
    const admin = [
      {
        email: process.env.SYSTEM_ADMIN_EMAIL,
        role: 'admin' as 'admin',
        full_name: 'admin',
        password: hashedPassword,
      },
      {
        email: 'employee@gmail.com',
        role: 'employee' as 'employee',
        full_name: 'employee',
        password: employeePassword,
      },
    ];
    const newUser = this.employeeRepository.create(admin);
    return await this.employeeRepository.save(newUser);
  }
}
