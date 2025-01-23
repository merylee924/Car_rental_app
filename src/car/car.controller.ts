import { Controller, Post, Get, Body, Query,Delete ,Param} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { FilterCarDto } from './dto/filter-car.dto';
import { CarCategory, FuelType } from "./enums/carEnums";


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
     @Get('getAllCars')
      getAllCars() {
        return this.carService.getAllCars();
      }
     @Get('nearby')
      getCarsNearby(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radius') radius: number
      ) {
        return this.carService.getCarsNearby(latitude, longitude, radius);
      }

    @Get('types')
    getCarTypes() {
      return {
        fuelTypes: Object.values(FuelType),
        carCategories: Object.values(CarCategory),
      };
    }

    @Delete('delete/:id')
    async deleteCar(@Param('id') id: number): Promise<{ message: string }> {
      await this.carService.deleteCarById(id);
      return { message: `Car with ID ${id} has been successfully deleted` };
    }
}
