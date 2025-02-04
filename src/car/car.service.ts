import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { Agency } from '../agency/entities/agency.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Model } from '../model/entities/model.entity';
import { User } from '../users/entities/user.entity';
import { FilterCarDto , PriceSort} from './dto/filter-car.dto';
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

  car.createdAt = new Date().toISOString();

  return this.carRepository.save(car);
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
      relations: ['model', 'model.brand'], 
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

async getLatestCars(): Promise<Car[]> {
  return this.carRepository.find({
    order: { createdAt: 'DESC' },
    take: 5,
  });
}
    
    
async getFilterOptions() {
  const [colors, years, brands] = await Promise.all([
    this.carRepository
      .createQueryBuilder("car")
      .select("DISTINCT car.color", "color")
      .where("car.color IS NOT NULL")
      .getRawMany(),
    this.carRepository
      .createQueryBuilder("car")
      .select("DISTINCT car.year", "year")
      .where("car.year IS NOT NULL")
      .orderBy("car.year", "DESC")
      .getRawMany(),
    this.brandRepository.find(),
  ])

  return {
    categories: Object.values(CarCategory),
    fuelTypes: Object.values(FuelType),
    colors: colors.map((c) => c.color),
    years: years.map((y) => y.year),
    brands: brands.map((brand) => brand.name),
  }
}

async applyFilters(filters: FilterCarDto): Promise<Partial<Car>[]> {
  let filteredCars = await this.carRepository.find({
    relations: ["model", "model.brand"],
  })

  if (filters.category) {
    filteredCars = filteredCars.filter((car) => car.category === filters.category)
  }
  if (filters.fuel) {
    filteredCars = filteredCars.filter((car) => car.fuelType === filters.fuel)
  }
  if (filters.color) {
    filteredCars = filteredCars.filter((car) => car.color === filters.color)
  }
  if (filters.year) {
    filteredCars = filteredCars.filter((car) => car.year === filters.year)
  }
  if (filters.brand) {
    filteredCars = filteredCars.filter(
      (car) => car.model && car.model.brand && car.model.brand.name === filters.brand,
    )
  }

  if (filters.priceSort) {
    filteredCars = filteredCars.sort((a, b) => {
      if (filters.priceSort === PriceSort.ASC) {
        return a.pricePerDay - b.pricePerDay
      } else if (filters.priceSort === PriceSort.DESC) {
        return b.pricePerDay - a.pricePerDay
      }
      return 0
    })
  }

  return filteredCars.map((car) => ({
    id: car.id,
    color: car.color,
    brandName: car.model?.brand?.name,
    modelName: car.model?.name,
    pricePerDay: car.pricePerDay,
    nbrPersonnes: car.nbrPersonnes,
    imageUrl: car.imageUrl,
    fuelType: car.fuelType,
    year: car.year,
  }))
}

async getCarDetailsById(carId: number) {
  try {
    const car = await this.carRepository.findOne({
      where: { id: carId },
      relations: ['model', 'model.brand', 'agency', 'agency.user'], // Charger les relations
    });

    if (!car) {
      throw new Error('Car not found');
    }

    // Extraire les données liées
    const agency = car.agency;
    const owner = agency ? agency.user : null;
    const model = car.model;
    const brand = model ? model.brand : null;

    return {
      carId: car.id,  // Ajout de carId
      agencyId: agency ? agency.id : null,  // Ajout de agencyId
      ownerId: owner ? owner.id : null,  // Ajout de ownerId
      image: car.imageUrl,
      brand: brand ? brand.name : null,
      model: model ? model.name : null,
      category: car.category,
      nbrPersonnes: car.nbrPersonnes,
      fuel: car.fuelType,
      year: car.year,
      priceOfDay: car.pricePerDay,
      agencyImage: agency ? agency.imageBase64 : null,
      agencyName: agency ? agency.name : null,
      ownerImage: owner ? owner.picture : null,
      ownerName: owner ? `${owner.firstName} ${owner.lastName}` : null,
    };
  } catch (error) {
    console.error('Error fetching car details:', error);
    throw error;
  }
}

}
