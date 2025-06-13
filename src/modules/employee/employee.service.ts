import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { UserRole } from '../../shared/types/enums';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private userRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const existing = await this.userRepository.findOne({
        where: { email: createEmployeeDto.email, is_deleted: false },
      });
      if (existing) throw new BadRequestException('Employee already exists');
      // const hashedPassword: string = await hash(createEmployeeDto.password, 10);
      // createEmployeeDto.password = hashedPassword;
      const newUser = this.userRepository.create({
        ...createEmployeeDto,
        role: UserRole.EMPLOYEE,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  async findAll({
    page = { limit: 10, offset: 1 },
    search,
    filters = { is_deleted: false },
    sort = { by: 'created_at', order: 'DESC' },
  }: any): Promise<any> {
    try {
      const existing = this.userRepository
        .createQueryBuilder('employee')
        .where('employee.is_deleted = :is_deleted', {
          is_deleted: filters?.is_deleted ?? false,
        });

      if (search) {
        existing.andWhere(
          'employee.full_name ILIKE :search OR employee.email ILIKE :search',
          {
            search: `%${search}%`,
          },
        );
      }
      if (sort.by && sort.order) {
        existing.orderBy(`employee.${sort.by}`, sort.order);
      }
      if (filters) {
        existing.andWhere(filters);
      }
      const total = await existing.getCount();
      const data = await existing
        .skip((page.offset - 1) * page.limit)
        .take(page.limit)
        .getMany();

      return { total, data, limit: page.limit, offset: page.offset };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch employee list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Employee> {
    try {
      const existing = await this.userRepository.findOne({
        where: { id, is_deleted: false },
      });

      if (!existing) {
        throw new NotFoundException('Employee not found');
      }

      return existing;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch employee details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      const existing = await this.userRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) throw new NotFoundException('Employee not found');
      const updatedUser = this.userRepository.merge(
        existing,
        updateEmployeeDto,
      );
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to update employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const existing = await this.userRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing) {
        throw new NotFoundException('Employee not found');
      }
      const employee = this.userRepository.merge(existing, {
        is_deleted: true,
        deleted_at: new Date(),
      });
      await this.userRepository.save(employee);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      } else if (error.code === '23503') {
        throw new HttpException(
          'Cannot delete employee due to related records in other tables',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to delete employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
