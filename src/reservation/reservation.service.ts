import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from './enums/reservationEnums';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async checkCarAvailability(carId: number, startDate: Date, endDate: Date): Promise<boolean> {
    const existingReservations = await this.reservationRepository.find({
      where: { car: { id: carId }, status: ReservationStatus.PENDING },
    });

    return !existingReservations.some((r) =>
      (startDate >= r.startDate && startDate <= r.endDate) ||
      (endDate >= r.startDate && endDate <= r.endDate) ||
      (startDate <= r.startDate && endDate >= r.endDate)
    );
  }

  async create(createReservationDto: CreateReservationDto) {
    const { userId, carId, ownerId, startDate, endDate } = createReservationDto;

    const isAvailable = await this.checkCarAvailability(carId, new Date(startDate), new Date(endDate));
    if (!isAvailable) {
      return { message: 'The car is not available for these dates.' };
    }

    const reservation = this.reservationRepository.create({
      user: { id: userId },
      car: { id: carId },
      owner: { id: ownerId },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: ReservationStatus.PENDING,
    });

    await this.reservationRepository.save(reservation);
    return { message: 'Your reservation has been sent to the owner.' };
  }

  async findReservationsForOwner(ownerId: number) {
    return this.reservationRepository.find({
      where: { owner: { id: ownerId }, status: ReservationStatus.PENDING },
      relations: ['user', 'car'],
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        user: {
          id: true,
          lastName: true,
          firstName: true, 
        },
        car: {
          id: true,
          imageUrl: true,
        },
      },
    });
  }

  async updateReservationStatus(id: number, updateReservationDto: UpdateReservationDto) {
    const { status } = updateReservationDto;
    await this.reservationRepository.update(id, { status });

    return {
      message: `Réservation ${status === ReservationStatus.ACCEPTED ? 'acceptée' : 'refusée'}.`,
    };
  }

  async findReservationStatusForUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: ['car'],
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        car: {
          id: true,
          imageUrl: true,
        },
      },
    });
  }
}
