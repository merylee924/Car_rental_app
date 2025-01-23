import { IsInt, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  userId: number;

  @IsInt()
  carId: number;

  @IsDateString()
  reservationDate: string;

  @IsDateString()
  returnDate: string;
}
