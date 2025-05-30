import { BaseEntity } from '../../../shared/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { FactoryParams } from './facory-param.entity';

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
