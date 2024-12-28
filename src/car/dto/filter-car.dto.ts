import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class FilterCarDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerDayMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerDayMax?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  agencyId?: number;
}
