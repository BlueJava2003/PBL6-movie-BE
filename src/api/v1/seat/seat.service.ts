import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { PrismaService } from 'src/prisma.service';
import { Seat } from '@prisma/client';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}
  async createSeat(createSeatDto: CreateSeatDto): Promise<Seat> {
    try {
      const seatType = await this.prisma.seatType.findUnique({
        where: { id: createSeatDto.seatTypeId },
      });
      if (!seatType)
        throw new HttpException('Seat Type Not Found!', HttpStatus.BAD_REQUEST);
      const seat = await this.prisma.seat.create({
        data: createSeatDto,
      });
      return seat;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
