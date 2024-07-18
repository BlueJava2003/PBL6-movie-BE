import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeatStateDto } from './dto/create-seat-state.dto';
import { UpdateSeatStateDto } from './dto/update-seat-state.dto';
import { PrismaService } from 'src/prisma.service';
import { SeatState } from '@prisma/client';

@Injectable()
export class SeatStateService {
  constructor(private prisma: PrismaService) {}
  async createSeatState(
    createSeatStateDto: CreateSeatStateDto,
  ): Promise<SeatState> {
    try {
      const seatState = await this.prisma.seatState.create({
        data: createSeatStateDto,
      });
      return seatState;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all seatState`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seatState`;
  }

  update(id: number, updateSeatStateDto: UpdateSeatStateDto) {
    return `This action updates a #${id} seatState`;
  }

  remove(id: number) {
    return `This action removes a #${id} seatState`;
  }
}
