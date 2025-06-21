import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Param } from '../factory/entities/param.entity';
import { Factory } from '../factory/entities/factory.entity';
import { FactoryParams } from '../factory/entities/facory-param.entity';

export interface Facility {
  id: number;
  name: string;
  description: string;
}

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Param)
    private paramRepository: Repository<Param>,
    @InjectRepository(Factory)
    private factoryRepository: Repository<Factory>,
    @InjectRepository(FactoryParams)
    private factoryParamsRepository: Repository<FactoryParams>,
  ) {}

  async addParam(data: any): Promise<any> {
    try {
      const existing = await this.paramRepository.findOne({
        where: { is_deleted: false, name: data.name },
      });
      if (existing) {
        throw new BadRequestException('Param allready existing');
      }

      const factory = await this.factoryRepository.find({
        where: { is_deleted: false },
      });

      const lastData = await this.paramRepository.find({
        order: { sort: 'DESC' },
        take: 1,
      });
      const newParam = this.paramRepository.create({
        ...data,
        values: [],
        sort: lastData[0].sort + 1,
      });
      const result: any = await this.paramRepository.save(newParam);
      const factoryParams = factory.map((f) => {
        return this.factoryParamsRepository.create({
          factory_id: f.id,
          params_id: result.id,
          status: 0,
          visible: false,
        });
      });
      if (factoryParams.length > 0) {
        await this.factoryParamsRepository.save(factoryParams);
      }
      return result;
    } catch (error) {
      console.log(error);

      throw new HttpException(
        error.message || 'Failed to add param',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findParam(): Promise<any> {
    try {
      const existing = await this.paramRepository.find({
        where: { is_deleted: false },
      });

      if (!existing) {
        throw new HttpException(
          'Factory param Not Found',
          HttpStatus.NOT_FOUND,
        );
      }
      return existing;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch param list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateParam(id: number, data: any): Promise<any> {
    try {
      const param = await this.paramRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!param) {
        throw new HttpException('Param not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(param, data);
      return await this.paramRepository.save(param);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        'Failed to update param',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteParam(id: number): Promise<any> {
    try {
      const param = await this.paramRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!param) {
        throw new HttpException('Param not found', HttpStatus.NOT_FOUND);
      }
      param.is_deleted = true;
      return await this.paramRepository.save(param);
    } catch (error) {
      if (error.status === 404) throw error;
      throw new HttpException(
        'Failed to delete param',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
