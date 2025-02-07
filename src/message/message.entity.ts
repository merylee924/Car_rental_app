import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Conversation } from '../conversation/conversation.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages, { eager: true }) // Relation avec l'expéditeur
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages, { eager: true }) // Relation avec le destinataire
  receiver: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}
