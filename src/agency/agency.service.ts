import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './entities/agency.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { User } from '../users/user.entity'; // Import de l'entité User

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,

    @InjectRepository(User) // Injection du dépôt User
    private readonly userRepository: Repository<User>,
  ) {}

  async createAgency(data: CreateAgencyDto): Promise<Agency> {
    const agency = this.agencyRepository.create(data);

    if (data.location) {
      agency.location = {
        type: 'Point',
        coordinates: data.location.coordinates,
      };
    }

    // Récupérer l'utilisateur avec l'ID donné
    const user = await this.userRepository.findOneBy({ id: data.userId });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    agency.user = user;

    return await this.agencyRepository.save(agency);
  }

  async getAgencies(): Promise<Agency[]> {
    return this.agencyRepository.find();
  }

  async getCarsByAgency(agencyId: number) {
    const agency = await this.agencyRepository.findOne({
      where: { id: agencyId },
      relations: ['cars'],
    });
    if (!agency) {
      throw new Error(`Agency with ID ${agencyId} not found`);
    }
    return agency.cars;
  }
}
