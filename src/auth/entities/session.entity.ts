import { ISession } from 'connect-typeorm';
import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity('sessions')
export class TypeORMSession implements ISession {
  @Index()
  @Column('bigint')
  expiredAt: number;

  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @Column('text')
  json: string;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt?: Date;
}
