import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Brand } from '../../brand/entities/brand.entity';
import { Model } from '../../model/entities/model.entity';
import { Agency } from '../../agency/entities/agency.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Brand, (brand) => brand.cars, { nullable: false, onDelete: 'CASCADE' })
  brand: Brand;

  @ManyToOne(() => Model, (model) => model.cars, { nullable: false, onDelete: 'CASCADE' })
  model: Model;

  @Column()
  color: string;

  @Column()
  pricePerDay: number;

  @Column({ nullable: true })
  year?: number;

  @Column({ default: false })
  isRented: boolean;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Agency, (agency) => agency.cars, { nullable: false, onDelete: 'CASCADE' })
  agency: Agency;
}
