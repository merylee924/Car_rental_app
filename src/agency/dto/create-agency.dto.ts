import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
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

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocation)
  location?: GeoLocation;
}
