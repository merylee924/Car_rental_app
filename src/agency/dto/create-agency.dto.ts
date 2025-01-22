import { IsString, IsOptional, IsObject, ValidateNested, IsBase64, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class GeoLocation {
  @IsString()
  type: 'Point';

  @IsOptional()
  coordinates: [number, number];
}

export class CreateAgencyDto {
  @IsString()
  name: string;

   @IsString()
   description: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocation)
  location?: GeoLocation;

  @IsBase64()
  imageBase64: string;

  @IsNumber()
  userId: number;
}
