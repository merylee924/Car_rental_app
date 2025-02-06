import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Message } from '../message/message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userConversations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, (user) => user.ownerConversations, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
