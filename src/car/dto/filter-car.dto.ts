import { IsOptional, IsString } from 'class-validator';

export class FilterCarDto {
  @IsOptional()
  @IsString()
  brandName?: string;

  @IsOptional()
  @IsString()
  modelName?: string;
}
