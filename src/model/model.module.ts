import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { Model } from './entities/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Model])],
  providers: [ModelService],
  controllers: [ModelController],
  exports: [ModelService],
})
export class ModelModule {}
