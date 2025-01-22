import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

    @Column({ nullable: true })
   description: string;
    @Column({ nullable: true })
     imageBase64: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location?: { type: 'Point'; coordinates: [number, number] };

  @OneToMany(() => Car, (car) => car.agency, { cascade: true })
  cars: Car[];

  @OneToOne(() => User, user => user.agency)
  user: User; // Relation OneToOne avec User
}
