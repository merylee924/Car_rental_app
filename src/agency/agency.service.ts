import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './entities/agency.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { User } from '../users/entities/user.entity'; // Import de l'entité User

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

  async getAgencies(): Promise<any[]> {
    try {
        // Récupérer les agences avec leur relation user
        const agencies = await this.agencyRepository.find({ 
            relations: ['user'] 
        });

        // Transformer les données pour inclure userId
        return agencies.map(agency => ({
            id: agency.id,
            name: agency.name,
            description: agency.description,
            imageBase64: agency.imageBase64,
            location: agency.location,
            userId: agency.user ? agency.user.id : null  // Récupérer l'ID de l'utilisateur s'il existe
        }));
    } catch (error) {
        console.error("Error fetching agencies:", error);
        throw new Error("Could not fetch agencies");
    }
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


    async findAgencyByUserId(userId: number): Promise<Agency | null> {
      return this.agencyRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    }
    async findAgencyIdByUsername(username: string): Promise<number> {
      const user = await this.userRepository.findOne({
        where: { username },
        relations: ['agency'], // Inclure la relation entre User et Agency
      });

      if (!user || !user.agency) {
        throw new Error('Agence non trouvée pour cet utilisateur');
      }

      return user.agency.id; // Retourne l'ID de l'agence
    }

    async findAgencyInfoByUsername(username: string): Promise<Agency> {
      const user = await this.userRepository.findOne({
        where: { username },
        relations: ['agency'], // Inclure la relation entre User et Agency
      });

      if (!user || !user.agency) {
        throw new Error('Agence non trouvée pour cet utilisateur');
      }
    
      return user.agency;
    }

    async findAgencyById(id: number): Promise<Agency> {
      const agency = await this.agencyRepository.findOne({
        where: { id },
        relations: ['user'], 
      });
      if (!agency) {
        throw new NotFoundException(`Agency with ID ${id} not found`);
      }
      return agency;
    }
    

}
