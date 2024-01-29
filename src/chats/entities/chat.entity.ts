import { User } from 'src/auth/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 500,
  })
  messageContent: string;

  @Column({ default: false })
  isDeletedBySender: boolean;

  @Column({ default: false })
  isDeletedByReceiver: boolean;

  // Soft delete column
  @DeleteDateColumn({
    name: 'isDeletedForEveryone',
    type: 'timestamp',
    default: null,
  })
  isDeletedForEveryone: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sender, {
    onDelete: 'SET NULL',
  })
  sender: User;

  @ManyToOne(() => User, (user) => user.receiver, {
    onDelete: 'SET NULL',
  })
  receiver: User;
}
