import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { FactoryParams } from './facory-param.entity';

@Entity({ name: 'factory_log' })
export class FactoryLog extends BaseEntity {
  @Column()
  factory_id: number;

  @Column()
  factory_params_id: number;

  @Column({ type: 'timestamp' })
  date_update: string;

  @Column()
  params_id: number;

  @Column()
  value: string;

  @Column({ nullable: true })
  izoh: string;

  @ManyToOne(() => FactoryParams, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'factory_params_id' })
  factoryParams: FactoryParams;
}
