import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get('/getAll')
  findAll() {
    return this.modelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelService.findOne(+id);
  }

   @Post('/create')
    async create(@Body() createModelDto: CreateModelDto) {
      return this.modelService.createModel(createModelDto);
    }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateModelDto: UpdateModelDto) {
    return this.modelService.update(+id, updateModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelService.remove(+id);
  }
}
