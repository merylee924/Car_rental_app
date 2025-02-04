import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Model } from '../../model/entities/model.entity';


@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Model, (model) => model.brand)
  models: Model[];



}
