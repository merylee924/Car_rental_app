import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { AgencyModule } from '../agency/agency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]),
    AgencyModule,
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
