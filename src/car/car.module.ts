import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Model } from '../model/entities/model.entity';
import { Brand } from '../brand/entities/brand.entity';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { AgencyModule } from '../agency/agency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car,Brand,Model]),
    AgencyModule,
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
