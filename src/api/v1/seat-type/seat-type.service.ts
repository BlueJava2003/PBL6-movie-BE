import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeatTypeDto } from './dto/create-seat-type.dto';
import { UpdateSeatTypeDto } from './dto/update-seat-type.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SeatTypeService {
  constructor(private prisma: PrismaService) {}
  async createSeat(createSeatTypeDto: CreateSeatTypeDto) {
    try {
      return await this.prisma.seatType.create({ data: createSeatTypeDto });
    } catch (err) {
      console.error(err);
      throw new HttpException('Create fail!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllSeat() {
    try {
      return await this.prisma.seatType.findMany();
    } catch (err) {
      throw new HttpException('Something wrong happend!', HttpStatus.CONFLICT);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.seatType.findUnique({ where: { id } });
    } catch (err) {
      throw new HttpException('Something wrong happend!', HttpStatus.CONFLICT);
    }
  }

  async updateSeat(id: number, updateSeatTypeDto: UpdateSeatTypeDto) {
    try {
      return await this.prisma.seatType.update({
        where: { id },
        data: updateSeatTypeDto,
      });
    } catch (err) {
      throw new HttpException('Something wrong happend!', HttpStatus.CONFLICT);
    }
  }

  async removeSeat(id: number) {
    try {
      return await this.prisma.seatType.delete({ where: { id } });
    } catch (err) {
      throw new HttpException('Something wrong happend!', HttpStatus.CONFLICT);
    }
  }
}
