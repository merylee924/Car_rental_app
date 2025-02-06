import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Conversation } from '../conversation/conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @ManyToOne(() => User, (user) => user.messages)
  receiver: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
   conversation: Conversation;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
