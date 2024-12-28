import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { Car } from '../car/entities/car.entity';

@Controller('agencies')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post('/create')
  createAgency(@Body() data: CreateAgencyDto) {
    return this.agencyService.createAgency(data);
  }

  @Get('/getAgencies')
  getAgencies() {
    return this.agencyService.getAgencies();
  }

  @Get(':agencyId/cars')
  async getCarsByAgency(@Param('agencyId') agencyId: number): Promise<Car[]> {
    return this.agencyService.getCarsByAgency(agencyId);
  }
}
