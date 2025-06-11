import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { FactoryParams } from './facory-param.entity';

@Entity()
export class Param extends BaseEntity {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'jsonb' })
  values: Record<string, string>[];

  @Column({ type: 'boolean', nullable: true })
  visible: boolean | null;

  @Column()
  sort: number;

  @Column({ default: '0' })
  default_value: string;

  @OneToMany(() => FactoryParams, (fp) => fp.param)
  factoryParams: FactoryParams[];
}
