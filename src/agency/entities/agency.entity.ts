import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Car } from '../../car/entities/car.entity';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location?: { type: 'Point'; coordinates: [number, number] };

  @OneToMany(() => Car, (car) => car.agency, { cascade: true })
  cars: Car[];
}
