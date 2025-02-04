import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('create')
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get('owner/:ownerId')
  async findReservationsForOwner(@Param('ownerId') ownerId: number): Promise<Reservation[]> {
    return this.reservationService.findReservationsForOwner(ownerId);
  }

  @Patch('owner/approve/:id')
  async approveReservation(@Param('id') id: number, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.updateReservationStatus(id, updateReservationDto);
  }

  @Get('user/:userId/status')
  async findReservationStatusForUser(@Param('userId') userId: number): Promise<Reservation[]> {
    return this.reservationService.findReservationStatusForUser(userId);
  }
}
