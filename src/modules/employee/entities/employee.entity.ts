import { BaseEntity } from '../../../shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Employee extends BaseEntity {
  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100, enum: ['admin', 'employee'] })
  role: 'admin' | 'employee';
}
