import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Factory } from './factory.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { FactoryLog } from './factory-log.entity';
import { Param } from './param.entity';

@Entity({ name: 'factory_params' })
@Unique(['factory_id', 'params_id'])
export class FactoryParams extends BaseEntity {
  @Column()
  factory_id: number;

  @Column()
  params_id: number;

  @Column()
  status: number;

  @Column({ type: 'boolean', default: false })
  visible: boolean;

  @ManyToOne(() => Factory, (factory) => factory.factoryParams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'factory_id' })
  factory: Factory;

  @ManyToOne(() => Param, (param) => param.factoryParams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'params_id' })
  param: Param;

  @OneToMany(() => FactoryLog, (log) => log.factoryParams)
  logs: FactoryLog[];
}
