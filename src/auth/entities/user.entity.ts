import { Chat } from 'src/chats/entities/chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 25,
  })
  username: string;

  @Column({
    length: 20,
    unique: true,
  })
  phone: string;

  @Column()
  password: string;

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

  @OneToMany(() => Chat, (chat) => chat.sender, {
    onDelete: 'SET NULL',
  })
  sender: Chat[];

  @OneToMany(() => Chat, (chat) => chat.receiver, {
    onDelete: 'SET NULL',
  })
  receiver: Chat[];
}
