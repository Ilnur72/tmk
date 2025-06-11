import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { Employee } from '../../modules/employee/entities/employee.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async seed() {
    await this.seedAdmin();
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
