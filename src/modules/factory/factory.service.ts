import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factory } from './entities/factory.entity';
import { FactoryLog } from './entities/factory-log.entity';
import { FactoryParams } from './entities/facory-param.entity';

@Injectable()
export class FactoryService {
  constructor(
    @InjectRepository(Factory)
    private factoryRepository: Repository<Factory>,
    @InjectRepository(FactoryLog)
    private factoryLogRepository: Repository<FactoryLog>,
    @InjectRepository(FactoryParams)
    private factoryParamRepository: Repository<FactoryParams>,
  ) {}

  async update(id: number, updateFactoryDto: any): Promise<Factory> {
    try {
      const existing = await this.factoryRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException('Factory Not Found', HttpStatus.NOT_FOUND);
      const updatedFactory = this.factoryRepository.merge(
        existing,
        updateFactoryDto,
      );
      return await this.factoryRepository.save(updatedFactory);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to update factory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateParam(id: number, updateFactoryDto: any): Promise<FactoryParams> {
    try {
      const existing = await this.factoryParamRepository.findOne({
        where: { id, is_deleted: false },
      });
      if (!existing)
        throw new HttpException('Factory Not Found', HttpStatus.NOT_FOUND);
      const updatedFactory = this.factoryParamRepository.merge(
        existing,
        updateFactoryDto,
      );
      return await this.factoryParamRepository.save(updatedFactory);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to update factory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateFactoryParam(
    params: { id: number; [key: string]: any }[],
  ): Promise<FactoryParams[]> {
    try {
      const updatedParams: FactoryParams[] = [];

      for (const param of params) {
        const existing = await this.factoryParamRepository.findOne({
          where: { id: param.id, is_deleted: false },
        });

        if (!existing) {
          // Muammo bo‘lmasligi uchun davom etamiz, yoki log qilib ketamiz
          console.warn(`Param ID ${param.id} not found or deleted`);
          continue;
        }

        const updated = this.factoryParamRepository.merge(existing, param);
        const saved = await this.factoryParamRepository.save(updated);
        updatedParams.push(saved);
      }

      return updatedParams;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to update factory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addFactoryLog(data: any): Promise<any> {
    try {
      const factoryLog = this.factoryLogRepository.create(data);
      return await this.factoryLogRepository.save(factoryLog);
    } catch (error) {
      throw new HttpException(
        'Failed to add factory log',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async findAllFactoryParams(query?: any): Promise<any> {}

  async findAll(query?: any): Promise<any> {
    try {
      const latestLogSubQuery = this.factoryLogRepository
        .createQueryBuilder('factory_log')
        .select('factory_log.id')
        .where('factory_log.factory_params_id = factoryParams.id')
        .orderBy('factory_log.date_update', 'DESC')
        .limit(1);
      const existing = this.factoryRepository
        .createQueryBuilder('factory')
        .leftJoinAndSelect('factory.factoryParams', 'factoryParams')
        .leftJoinAndSelect('factoryParams.param', 'param')
        .leftJoinAndMapOne(
          'factoryParams.latestLog',
          FactoryLog,
          'latestLog',
          `latestLog.id = (${latestLogSubQuery.getQuery()})`,
        )
        .orderBy('factory.id', 'DESC')
        .setParameters(latestLogSubQuery.getParameters())
        .where('factory.is_deleted = :is_deleted', {
          is_deleted: query?.filters?.is_deleted ?? false,
        })
        .andWhere('factoryParams.visible = :visible', {
          visible: true,
        });

      if (query?.filters?.factory_param_id) {
        existing.andWhere('factoryParams.id = :factory_param_id', {
          factory_param_id: query.filters.factory_param_id,
        });
      }

      const total = await existing.getCount();
      const data = await existing.getMany();
      return { total, data };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch factory list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllLog(query?: any): Promise<any> {
    try {
      console.log(query);

      const existing = this.factoryLogRepository
        .createQueryBuilder('factory_log')
        .where('factory_log.is_deleted = :is_deleted', {
          is_deleted: query?.filters?.is_deleted ?? false,
        })
        .orderBy('factory_log.date_update', 'DESC');

      if (query.factoryParamId) {
        existing.andWhere(
          'factory_log.factory_params_id = :factory_params_id',
          {
            factory_params_id: query.factoryParamId,
          },
        );
      }

      const total = await existing.getCount();
      const data = await existing.getMany();
      return { total, data };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch factory list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const existing = this.factoryRepository
        .createQueryBuilder('factory')
        .leftJoinAndSelect('factory.factoryParams', 'factoryParams')
        .leftJoinAndSelect('factoryParams.param', 'param')
        .orderBy('factoryParams.visible', 'DESC')
        .where('factory.is_deleted = :is_deleted', {
          is_deleted: false,
        })
        .where('factory.id = :id', { id });
      const data = await existing.getMany();
      if (!data) {
        throw new HttpException('Factory Not Found', HttpStatus.NOT_FOUND);
      }
      return data;
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch factory details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneFactoryParam(id: number): Promise<any> {
    try {
      const existing = await this.factoryParamRepository.findOne({
        where: { id, is_deleted: false },
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
        'Failed to fetch factory param details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
