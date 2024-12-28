import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { FilterCarDto } from './dto/filter-car.dto';


@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  createCar(@Body() data: CreateCarDto) {
    return this.carService.createCar(data);
  }

   @Get('filter')
    filterCars(@Query() filters: FilterCarDto) {
      return this.carService.filterCars(filters);
    }
     @Get('nearby')
      getCarsNearby(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radius') radius: number
      ) {
        return this.carService.getCarsNearby(latitude, longitude, radius);
      }
}
