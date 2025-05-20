import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private userRepository: Repository<Employee>,
    private jwtService: JwtService,
  ) {}
  async staffLogin(body: any) {
    const employee = await this.userRepository
      .createQueryBuilder('employee')
      .where({ email: body.email, is_deleted: false })
      .addSelect(['employee.password', 'employee.role'])
      .getOne();
    if (!employee) {
      throw new NotFoundException();
    }

    const match = await compare(body.password, employee.password);

    if (!match) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.generateToken(employee.id, employee.role);
  }

  private generateToken(id: number, role: string) {
    const token = this.jwtService.sign({ user: { id, role } });
    return { token };
  }
}
