import { Controller, Post, Body,Get,Param} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { Reservation } from './entities/reservation.entity';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('create')
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

@Get('getAll')
  async findAll(): Promise<Reservation[]> {
    return this.reservationService.findAll();
  }

  // Get reservation by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Reservation> {
    return this.reservationService.findOne(id);
  }

  // Get reservations by user ID
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: number): Promise<Reservation[]> {
    return this.reservationService.findByUser(userId);
  }
   @Get('car/:carId')
    async findByCar(@Param('carId') carId: number): Promise<Reservation[]> {
      return this.reservationService.findByCar(carId);
    }
}
