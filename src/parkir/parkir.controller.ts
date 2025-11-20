import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { ParkirService } from './parkir.service';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';

@Controller('parkir')
export class ParkirController {
  constructor(private service: ParkirService) {}

  @Post()
  create(@Body() dto: CreateParkirDto) {
    return this.service.create(dto);
  }

  @Get('total')
  total() {
    return this.service.totalPendapatan();
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateParkirDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
