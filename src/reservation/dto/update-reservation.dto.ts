import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../enums/reservationEnums';

export class UpdateReservationDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
