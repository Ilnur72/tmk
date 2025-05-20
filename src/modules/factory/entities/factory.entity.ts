import { BaseEntity } from '../../../shared/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

interface location {
  lat: number;
  lng: number;
}

@Entity()
export class Factory extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, type: 'json' })
  location: location;

  @Column()
  elements: string;

  @Column()
  region: string;

  @Column()
  cats: string;

  @Column()
  manager: string;

  @Column()
  work_persent: string;

  @Column()
  coords: string;

  @Column()
  sort_num: number;

  @OneToMany(() => FactoryParams, (fp) => fp.factory)
  factoryParams: FactoryParams[];
}

@Entity({ name: 'factory_log' })
export class FactoryLog extends BaseEntity {
  @Column()
  factory_id: number;

  @Column({ type: 'timestamp' })
  date_update: number;

  @Column()
  params_id: number;

  @Column()
  value: string;

  @Column({ nullable: true })
  izoh: string;
}

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

@Entity({ name: 'factory_params' })
export class FactoryParams extends BaseEntity {
  @Column()
  factory_id: number;

  @Column()
  params_id: number;

  @Column()
  status: number;

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
}
