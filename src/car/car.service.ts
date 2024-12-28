import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { Agency } from '../agency/entities/agency.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  async createCar(data: CreateCarDto): Promise<Car> {
    const car = this.carRepository.create(data);

    if (data.agencyId) {
      const agency = await this.agencyRepository.findOne({ where: { id: data.agencyId } });
      if (!agency) {
        throw new Error(`Agency with ID ${data.agencyId} not found`);
      }
      car.agency = agency;
    }

    return this.carRepository.save(car);
  }

  async filterCars(filters: any): Promise<Car[]> {
     const queryBuilder = this.carRepository.createQueryBuilder('car');

     if (filters.brand) {
       queryBuilder.andWhere('car.brand = :brand', { brand: filters.brand });
     }
     if (filters.model) {
       queryBuilder.andWhere('car.model = :model', { model: filters.model });
     }
     if (filters.color) {
       queryBuilder.andWhere('car.color = :color', { color: filters.color });
     }
     if (filters.year) {
       queryBuilder.andWhere('car.year = :year', { year: filters.year });
     }
     if (filters.pricePerDayMin) {
       queryBuilder.andWhere('car.pricePerDay >= :pricePerDayMin', { pricePerDayMin: filters.pricePerDayMin });
     }
     if (filters.pricePerDayMax) {
       queryBuilder.andWhere('car.pricePerDay <= :pricePerDayMax', { pricePerDayMax: filters.pricePerDayMax });
     }
     if (filters.agencyId) {
       queryBuilder.andWhere('car.agencyId = :agencyId', { agencyId: filters.agencyId });
     }

     return queryBuilder.getMany();
   }

    async getCarsNearby(latitude: number, longitude: number, radius: number): Promise<Car[]> {
       const cars = await this.carRepository
         .createQueryBuilder('car')
         .leftJoinAndSelect('car.agency', 'agency')
         .where(
           `
           ST_DWithin(
             ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
             agency.location,
             :radius
           )
         `,
           { latitude, longitude, radius }
         )
         .getMany();

       return cars;
     }
}
