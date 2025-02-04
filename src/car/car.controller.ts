import { Controller, Post, Get, Body, Query,Delete ,Param} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { FilterCarDto } from './dto/filter-car.dto';
import { CarCategory, FuelType } from "./enums/carEnums";
import { Car } from './entities/car.entity';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  createCar(@Body() data: CreateCarDto) {
    return this.carService.createCar(data);
  }
  @Get('latest')
  async getLatestCars(): Promise<Car[]> {
    return this.carService.getLatestCars();
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
  @Get(':id/brand-model')
  async getCarBrandAndModel(@Param('id') carId: number) {
    return this.carService.getCarBrandAndModel(carId);
  }
  @Get("filter-options")
  async getFilterOptions() {
    return this.carService.getFilterOptions()
  }

  @Post('apply-filters')
  async applyFilters(@Body() filters: FilterCarDto) {
    try {
      const filteredCars = await this.carService.applyFilters(filters);
      return { cars: filteredCars };
    } catch (error) {
      console.error("Error applying filters:", error);
      throw error;
    }
  }

  @Get(':id/details')
  async getCarDetailsById(@Param('id') carId: number) {
    return this.carService.getCarDetailsById(carId);
  }
}
