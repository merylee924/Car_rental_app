import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Agency } from '../../agency/entities/agency.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  pricePerDay: number;

  @Column({ nullable: true })
  year?: number;

  @Column({ default: false })
  isRented: boolean;

  @ManyToOne(() => Agency, (agency) => agency.cars, { nullable: false, onDelete: 'CASCADE' })
  agency: Agency;
}
