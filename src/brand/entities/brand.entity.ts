import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Model } from '../../model/entities/model.entity';
import { Car } from '../../car/entities/car.entity';


@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Model, (model) => model.brand)
  models: Model[];



}
