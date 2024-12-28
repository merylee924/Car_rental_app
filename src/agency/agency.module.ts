import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { Car } from '../car/entities/car.entity';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, Car])],
  controllers: [AgencyController],
  providers: [AgencyService],
    exports: [TypeOrmModule],
})
export class AgencyModule {}