import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { PrismaService } from 'src/prisma.service';
import { Seat } from '@prisma/client';
import { CreateManySeatsDto } from './dto/create-many-seats.dto';
import { generateSeatNames } from 'src/api/util/createSeatNames.util';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}

  // Create new seat
  async createSeat(createSeatDto: CreateSeatDto): Promise<Seat> {
    try {
      const hasSeatExist = await this.prisma.seat.findFirst({
        where: {
          name: createSeatDto.name,
        },
      });
      const currentSeatQty = await this.prisma.seat.count();
      if (currentSeatQty + 1 > 50)
        // Check if Seat Qty will be larger than 50!
        throw new HttpException(
          'Seat Qty will be larger than 50!',
          HttpStatus.BAD_REQUEST,
        );
      if (hasSeatExist)
        throw new HttpException(
          'Seat Name has existed!',
          HttpStatus.BAD_REQUEST,
        );
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

  // Create new seat at the same time
  async createManySeats(creatManySeatsDto: CreateManySeatsDto) {
    try {
      const { rows, seatsPerRow, seatTypeId, startChar } = creatManySeatsDto;

      const seatType = await this.prisma.seatType.findUnique({
        where: {
          id: seatTypeId,
        },
      });
      if (!seatType)
        throw new HttpException('Seat Type Not Found!', HttpStatus.BAD_REQUEST);

      const seatNames = generateSeatNames(rows, seatsPerRow, startChar);
      const seats = seatNames.map((name) => ({ name, seatTypeId }));
      const currentSeatQty = await this.prisma.seat.count();
      if (currentSeatQty + seatsPerRow * rows > 50)
        throw new HttpException(
          'Seat Qty will be larger than 50!',
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.seat.createMany({
        data: seats,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException(
          'Duplicate seat names detected. Please ensure all seat names are unique.',
          HttpStatus.CONFLICT,
        );
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while creating seats',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  //Find all seat exists
  async findAllSeat(): Promise<Seat[]> {
    try {
      const allSeats = await this.prisma.seat.findMany();
      return allSeats;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Find a seat
  async findOneSeat(id: number): Promise<Seat> {
    try {
      const seat = await this.prisma.seat.findUnique({ where: { id } });
      return seat;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Update a seat info
  async updateSeat(
    id: number,
    updateSeatTypeDto: UpdateSeatDto,
  ): Promise<Seat> {
    try {
      const seat = await this.findOneSeat(id);
      if (!seat)
        throw new HttpException('Seat Not Found!', HttpStatus.BAD_REQUEST);
      const updatedSeat = await this.prisma.seat.update({
        where: { id },
        data: updateSeatTypeDto,
      });
      return updatedSeat;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Remove a seat
  async removeSeat(id: number): Promise<void> {
    try {
      const seat = await this.prisma.seat.findUnique({
        where: {
          id,
        },
      });
      if (!seat)
        throw new HttpException('Seat not found!', HttpStatus.BAD_REQUEST);
      await this.prisma.seat.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
