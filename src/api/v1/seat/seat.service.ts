import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { PrismaService } from 'src/prisma.service';
import { Seat } from '@prisma/client';
import { CreateManySeatsDto } from './dto/create-many-seats.dto';
import { generateSeatNames } from 'src/api/util/createSeatNames.util';

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
  async createManySeats(creatManySeatsDto: CreateManySeatsDto) {
    try {
      const { rows, seatsPerRow, seatTypeId, startChar } = creatManySeatsDto;
      const seatNames = generateSeatNames(rows, seatsPerRow, startChar);
      const seats = seatNames.map((name) => ({ name, seatTypeId }));
      const seatType = this.prisma.seatType.findUnique({
        where: {
          id: seatTypeId,
        },
      });
      if (!seatType)
        throw new HttpException('Seat Type Not Found!', HttpStatus.BAD_REQUEST);
      return await this.prisma.seat.createMany({
        data: seats,
        // skipDuplicates: true, // Optional: skip duplicate entries
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
