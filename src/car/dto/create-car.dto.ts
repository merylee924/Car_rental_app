import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateCarDto {
  @IsInt()
  brandId: number;

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
}
