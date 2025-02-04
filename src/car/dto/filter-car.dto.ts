import {  IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export enum PriceSort {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterCarDto {
  @IsOptional()
  @IsString()
  category?: string; 

  @IsOptional()
  @IsString()
  fuel?: string; 

  @IsOptional()
  @IsString()
  color?: string; 


  @IsOptional()
  @IsNumber()
  year?: number; 

  @IsOptional()
  @IsString()
  brand?: string; 

  @IsOptional()
  @IsEnum(PriceSort)
  priceSort?: PriceSort | null; 
}
