import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { Agency } from '../agency/entities/agency.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Model } from '../model/entities/model.entity';
import { FilterCarDto } from './dto/filter-car.dto';


@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async createCar(data: CreateCarDto): Promise<Car> {
    const car = this.carRepository.create(data);

    // Associer l'agence
    if (data.agencyId) {
      const agency = await this.agencyRepository.findOne({ where: { id: data.agencyId } });
      if (!agency) {
        throw new Error(`Agency with ID ${data.agencyId} not found`);
      }
      car.agency = agency;
    }

    // Associer la marque
    if (data.brandId) {
      const brand = await this.brandRepository.findOne({ where: { id: data.brandId } });
      if (!brand) {
        throw new Error(`Brand with ID ${data.brandId} not found`);
      }
      car.brand = brand;
    }

    // Associer le modèle
    if (data.modelId) {
      const model = await this.modelRepository.findOne({ where: { id: data.modelId } });
      if (!model) {
        throw new Error(`Model with ID ${data.modelId} not found`);
      }
      car.model = model;
    }

    return this.carRepository.save(car);
  }

   async filterCars(filters: FilterCarDto): Promise<Car[]> {
      const queryBuilder = this.carRepository.createQueryBuilder('car');

      // Filtrage par nom de la marque
      if (filters.brandName) {
        queryBuilder.innerJoinAndSelect('car.brand', 'brand')
          .andWhere('brand.name LIKE :brandName', { brandName: `%${filters.brandName}%` });
      }

      // Filtrage par nom du modèle
      if (filters.modelName) {
        queryBuilder.innerJoinAndSelect('car.model', 'model')
          .andWhere('model.name LIKE :modelName', { modelName: `%${filters.modelName}%` });
      }

      // Exécution de la requête et retour des résultats filtrés
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

  async getAllCars(): Promise<Car[]> {
    return this.carRepository.find({ relations: ['brand', 'model', 'agency'] });
  }
}
