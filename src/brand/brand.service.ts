import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  findAll() {
    return this.brandRepository.find({ relations: ['models'] });
  }

  findOne(id: number) {
    return this.brandRepository.findOne({
      where: { id },
      relations: ['models'],
    });
  }

  create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return this.brandRepository.update(id, updateBrandDto);
  }

  remove(id: number) {
    return this.brandRepository.delete(id);
  }
}
