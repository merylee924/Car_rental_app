import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import UserRole from '../userRole';
import { Agency } from '../../agency/entities/agency.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Conversation } from '../../conversation/conversation.entity';
import { Message } from '../../message/message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  // Relation OneToMany avec Reservation
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  // Relation OneToOne avec Agency
  @OneToOne(() => Agency, (agency) => agency.user, { nullable: true })
  agency: Agency;

  // Relation OneToMany avec Conversation (comme participant)
  @OneToMany(() => Conversation, (conversation) => conversation.user)
  userConversations: Conversation[];

  // Relation OneToMany avec Conversation (comme créateur)
  @OneToMany(() => Conversation, (conversation) => conversation.owner)
  ownerConversations: Conversation[];

  // Relation OneToMany avec Message (pour les messages envoyés par l'utilisateur)
  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
