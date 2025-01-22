import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Brand } from '../../brand/entities/brand.entity';
import { Car } from '../../car/entities/car.entity';

@Entity()
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Brand, (brand) => brand.models, { nullable: false, onDelete: 'CASCADE' })
  brand: Brand;

  @OneToMany(() => Car, (car) => car.model)
  cars: Car[];
}
