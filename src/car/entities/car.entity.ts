import { Entity, Column, PrimaryGeneratedColumn, ManyToOne ,OneToMany} from "typeorm"
import { Model } from "../../model/entities/model.entity"
import { Agency } from "../../agency/entities/agency.entity"
import { CarCategory, FuelType } from "../enums/carEnums"
import { Reservation } from "../../reservation/entities/reservation.entity";

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => Model,
    (model) => model.cars,
    { nullable: false, onDelete: "CASCADE" },
  )
  model: Model

  @Column()
  color: string

  @Column()
  pricePerDay: number

  @Column({ nullable: true })
  year?: number

  @Column({ default: false })
  isRented: boolean

  @Column({ nullable: true })
  imageUrl?: string

  @Column()
  nbrPersonnes: number

  @ManyToOne(
    () => Agency,
    (agency) => agency.cars,
    { nullable: false, onDelete: "CASCADE" },
  )
  agency: Agency

  @Column({
    type: "enum",
    enum: CarCategory,
    default: CarCategory.Family,
  })
  category: CarCategory

  @Column({
    type: "enum",
    enum: FuelType,
    default: FuelType.Essence,
  })
  fuelType: FuelType

  @OneToMany(
    () => Reservation,
    (reservation) => reservation.car
  )
  reservations: Reservation[]

  @Column({ nullable: true })
  createdAt?: string;

  
}

