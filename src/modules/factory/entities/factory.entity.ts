import { BaseEntity } from '../../../shared/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { FactoryParams } from './facory-param.entity';

export enum FactoryParamStatus {
  REGISTRATION = 'REGISTRATION',
  CONSTRUCTION = 'CONSTRUCTION',
  STARTED = 'STARTED',
}
export enum FactoryImportance {
  HIGH = 'HIGH',
  AVERAGE = 'AVERAGE',
  LOW = 'LOW',
}

enum MarkerIcon {
  'facory' = 'factory',
  'mine' = 'mine',
  'mine-cart' = 'mine-cart',
}

@Entity()
export class Factory extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column('text', { array: true })
  elements: any;

  @Column({
    nullable: true,
    default: FactoryParamStatus.REGISTRATION,
    enum: FactoryParamStatus,
  })
  status: FactoryParamStatus;

  @Column({
    nullable: true,
    default: FactoryImportance.AVERAGE,
    enum: FactoryImportance,
  })
  importance: FactoryImportance;

  @Column()
  region: string;

  @Column({ nullable: true })
  cats: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ nullable: true })
  work_persent: number;

  @Column()
  coords: string;

  @Column({ nullable: true })
  images: string;

  @Column({
    nullable: true,
    default: 'factory',
    enum: MarkerIcon,
    type: 'text',
  })
  marker_icon: MarkerIcon;

  @Column({ nullable: true })
  sort_num: number;

  @OneToMany(() => FactoryParams, (fp) => fp.factory)
  factoryParams: FactoryParams[];
}
