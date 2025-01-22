import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './entities/model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
  ) {}

  findAll() {
    return this.modelRepository.find({ relations: ['brand', 'cars'] });
  }

  findOne(id: number) {
    return this.modelRepository.findOne({
      where: { id },
      relations: ['brand', 'cars'],
    });
  }
 async createModel(createModelDto: CreateModelDto): Promise<Model> {
    const model = this.modelRepository.create(createModelDto); // Crée une instance du modèle
    return this.modelRepository.save(model);  // Sauvegarde le modèle dans la base de données
  }

  update(id: number, updateModelDto: UpdateModelDto) {
    return this.modelRepository.update(id, updateModelDto);
  }

  remove(id: number) {
    return this.modelRepository.delete(id);
  }
}
