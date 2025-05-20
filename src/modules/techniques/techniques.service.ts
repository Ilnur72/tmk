import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { UpdateTechniqueDto } from './dto/update-technique.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cars } from './entities/technique.entity';

@Injectable()
export class TechniquesService {
  constructor(
    @InjectRepository(Cars)
    private CarsRepository: Repository<Cars>,
  ) {}
  create(createTechniqueDto: CreateTechniqueDto) {
    return 'This action adds a new technique';
  }

  async findAll(query?: any): Promise<any> {
    try {
      const existing = this.CarsRepository.createQueryBuilder('cars').where(
        'cars.is_deleted = :is_deleted',
        {
          is_deleted: query?.filters?.is_deleted ?? false,
        },
      );

      const total = await existing.getCount();
      const data = await existing.getMany();
      return { total, data };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch cars list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} technique`;
  }

  update(id: number, updateTechniqueDto: UpdateTechniqueDto) {
    return `This action updates a #${id} technique`;
  }

  remove(id: number) {
    return `This action removes a #${id} technique`;
  }
}
