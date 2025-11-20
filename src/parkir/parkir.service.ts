import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { timeEnd } from 'console';
import { IsTimeZone } from 'class-validator';

@Injectable()
export class ParkirService {
  constructor(private prisma: PrismaService) {}

  // Hitung tarif parkir
  hitungTotal(jenis: string, durasi: number): number {
    const tarif = {
      RODA2: { pertama: 3000, berikut: 2000 },
      RODA4: { pertama: 6000, berikut: 4000 },
    };

    if (durasi === 1) return tarif[jenis].pertama;

    return tarif[jenis].pertama + (durasi - 1) * tarif[jenis].berikut;
  }

  //=================================================================//

  async create(dto: CreateParkirDto) {
    try{
      // const durasiJam = Math.ceil(dto.durasi / 60);
    const total = this.hitungTotal(dto.jenisKendaraan, dto.durasi);
    const result = await this.prisma.parkir.create({
      data: {
        ...dto,
        total,
      },
    });

    return{
      success: true,
      message: "Data has been created successfully",
      data: result
    }
    }catch(error){
      return{
        success: false,
        message: `Something went wrong ${error}`,
        data: null
      }
    }
  }

  //=================================================================//

  findAll() {
    return this.prisma.parkir.findMany();
  }

  //=================================================================//

  async findOne(id: number) {
    try {
    const data = await this.prisma.parkir.findUnique({ where: { id } });
    
    if (!data) {
      return {
        success: false,
        message: `Data parkir tidak ditemukan dengan id ${id}`,
        data: null
      };
    }
    
    return {
      success: true,
      message: "Data ditemukan",
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: `Something went wrong ${error}`,
      data: null
    };
  }
  }

  //=================================================================//

  async update(id: number, dto: UpdateParkirDto) {
    try {
    const data = await this.prisma.parkir.findUnique({ where: { id } });
    
    if (!data) {
      return {
        success: false,
        message: `Data parkir tidak ditemukan dengan id ${id}`,
        data: null
      };
    }
    
    return {
      success: true,
      message: "Update successfully",
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: `Something went wrong ${error}`,
      data: null
    };
  }
  }

  //=================================================================//

  async remove(id: number) {
    try{
      const findData = await this.prisma.parkir.findFirst({where: {id : id}})
      if(!findData){
        return{
          success: false,
          message: `The id doesn't exist, The current is ${id}`,
          data: null
        }
      }
      const remove = await this.prisma.parkir.delete({ where: {id} })
      return{
        success: true,
        message: "Deleted successfully",
        data: remove
      }
    }catch(error){
      return{
        sucess: false,
        message: `Something went wrong ${error}`
      }
    }
    // await this.findOne(id);
    // return this.prisma.parkir.delete({ where: { id } });
  }
  

  async totalPendapatan() {
    try{
      const allData = await this.prisma.parkir.findMany();
      if (!allData) {
        return{
          success: false,
          message: "There is no payment",
          data:null
        }
      }
      const now = new Date()
    .toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
      return{
        success: true,
        date: now,
        total: allData.reduce((sum, item) => sum + item.total, 0),
      }
    }catch(error){
      return{
        success: false,
        message: `Something went wrong ${error}`,
        data:null
      }
    }
  }
}
