import { BaseEntity } from '../../../shared/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { FactoryParams } from './facory-param.entity';

export enum FactoryParamStatus {
  REGISTRATION = 'REGISTRATION',
  CONSTRUCTION = 'CONSTRUCTION',
  STARTED = 'STARTED',
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

  @Column({ nullable: true })
  images: string;

  @Column()
  sort_num: number;

  @OneToMany(() => FactoryParams, (fp) => fp.factory)
  factoryParams: FactoryParams[];
}
