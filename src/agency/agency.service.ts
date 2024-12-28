import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './entities/agency.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  async createAgency(data: CreateAgencyDto): Promise<Agency> {
    const agency = this.agencyRepository.create(data);
    if (data.location) {
      agency.location = {
        type: 'Point',
        coordinates: data.location.coordinates,
      };
    }
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
