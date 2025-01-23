import { IsString, IsNumber, IsOptional, IsInt, IsEnum } from 'class-validator';
import { CarCategory, FuelType } from '../enums/carEnums';

export class CreateCarDto {
  @IsInt()
  modelId: number;

  @IsString()
  color: string;

  @IsNumber()
  pricePerDay: number;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsInt()
  agencyId?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsEnum(CarCategory)
  category: CarCategory;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsInt()
  nbrPersonnes: number;


  @IsOptional()
  @IsString()
  createdAt?: string;
}
