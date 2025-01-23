import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { Car } from '../car/entities/car.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    // Fetch the car and user
    const car = await this.carRepository.findOneOrFail({ where: { id: createReservationDto.carId } });
    const user = await this.userRepository.findOneOrFail({ where: { id: createReservationDto.userId } });

    // Check if the car is already rented (isRented is true)
    if (car.isRented) {
      throw new Error(`Car with ID ${car.id} is currently rented and cannot be reserved.`);
    }

    // Create the reservation
    const reservation = this.reservationRepository.create({
      car,
      user,
      startDate: createReservationDto.reservationDate,
      endDate: createReservationDto.returnDate,
      createdBy: user,
    });

    // Save and return the reservation
    return this.reservationRepository.save(reservation);
  }
  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async findOne(id: number): Promise<Reservation> {
    return this.reservationRepository.findOne({ where: { id } });
  }

  async findByUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({ where: { user: { id: userId } } });
  }

  async findByCar(carId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({ where: { car: { id: carId } } });
  }

}
