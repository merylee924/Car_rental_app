import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { Agency } from '../agency/entities/agency.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Model } from '../model/entities/model.entity';
import { FilterCarDto } from './dto/filter-car.dto';
import { CarCategory, FuelType } from './enums/carEnums';


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

  // Associer le modèle
  if (data.modelId) {
    const model = await this.modelRepository.findOne({ where: { id: data.modelId } });
    if (!model) {
      throw new Error(`Model with ID ${data.modelId} not found`);
    }
    car.model = model;
  }

  // Associer la catégorie de voiture
  if (data.category) {
    if (!(data.category in CarCategory)) {
      throw new Error(`Invalid car category: ${data.category}`);
    }
    car.category = data.category;
  }

  // Associer le type de carburant
  if (data.fuelType) {
    if (!(data.fuelType in FuelType)) {
      throw new Error(`Invalid fuel type: ${data.fuelType}`);
    }
    car.fuelType = data.fuelType;
  }

  // Ajouter les autres champs supplémentaires
  if (data.color) {
    car.color = data.color;
  }

  if (data.pricePerDay)
    car.pricePerDay = data.pricePerDay;


  if (data.year) {
    car.year = data.year;
  }

  if (data.imageUrl) {
    car.imageUrl = data.imageUrl;
  }

  if (data.nbrPersonnes) {
    car.nbrPersonnes = data.nbrPersonnes;
  }

  car.createdAt = data.createdAt || new Date().toISOString();


  return this.carRepository.save(car);
}



   async filterCars(filters: FilterCarDto): Promise<Car[]> {
      const queryBuilder = this.carRepository.createQueryBuilder('car');



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
    return this.carRepository.find({ relations: [ 'model', 'agency'] });
  }

  async deleteCarById(carId: number): Promise<void> {
    const car = await this.carRepository.findOne({ where: { id: carId } });

    if (!car) {
      throw new Error(`Car with ID ${carId} not found`);
    }

    await this.carRepository.remove(car);
  }

  async getCarBrandAndModel(carId: number) {
      const car = await this.carRepository.findOne({
        where: { id: carId },
        relations: ['model', 'model.brand'], // Ensure relations are loaded
      });

      if (!car) {
        throw new NotFoundException(`Car with ID ${carId} not found.`);
      }

      return {
        brandName: car.model.brand.name,
        modelName: car.model.name,
      };
    }
    
    async findAgencyById(agencyId: number): Promise<Agency | null> {
      const agency = await this.agencyRepository.findOne({
        where: { id: agencyId },
      });
    
      if (!agency) {
        throw new Error(`Agence avec l'ID ${agencyId} non trouvée`);
      }
    
      return agency;
    }
    
}
