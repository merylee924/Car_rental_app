import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCarDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  color: string;

  @IsNumber()
  pricePerDay: number;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsNumber()
  agencyId?: number;
}
