export class Technique {}
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('cars')
export class Cars extends BaseEntity {
  @Column()
  carnum: string;

  @Column()
  type: string;

  @Column()
  model: string;

  @Column()
  location: string;

  @Column()
  coords: string;
}
