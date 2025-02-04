import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import UserRole from '../userRole';
import { Agency } from '../../agency/entities/agency.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

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

  // Nouvelle relation OneToOne avec Agency
  @OneToOne(() => Agency, (agency) => agency.user, { nullable: true })
  agency: Agency;
}
