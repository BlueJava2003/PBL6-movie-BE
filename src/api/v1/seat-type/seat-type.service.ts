import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatTypeDto } from './dto/create-seat-type.dto';
import { UpdateSeatTypeDto } from './dto/update-seat-type.dto';
import { PrismaService } from 'src/prisma.service';
import { SeatType } from '@prisma/client';

@Injectable()
export class SeatTypeService {
  constructor(private prisma: PrismaService) {}
  async createSeatType(
    createSeatTypeDto: CreateSeatTypeDto,
  ): Promise<SeatType> {
    try {
      const seatType = await this.prisma.seatType.create({
        data: createSeatTypeDto,
      });
      return seatType;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllSeatType(): Promise<SeatType[]> {
    try {
      const allSeatTypes = await this.prisma.seatType.findMany();
      return allSeatTypes;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneSeatType(id: number): Promise<SeatType> {
    try {
      const seatType = await this.prisma.seatType.findUnique({ where: { id } });
      return seatType;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSeatType(
    id: number,
    updateSeatTypeDto: UpdateSeatTypeDto,
  ): Promise<SeatType> {
    try {
      const seatType = await this.findOneSeatType(id);
      if (!seatType)
        throw new HttpException('Seat Type Not Found!', HttpStatus.BAD_REQUEST);
      const updatedSeat = await this.prisma.seatType.update({
        where: { id },
        data: updateSeatTypeDto,
      });
      return updatedSeat;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeSeatType(id: number): Promise<void> {
    try {
      const seatType = await this.findOneSeatType(id);
      if (!seatType) {
        throw new HttpException('Seat Type Not Found!', HttpStatus.BAD_REQUEST);
      }
      await this.prisma.seat.deleteMany({
        where: {
          seatTypeId: id,
        },
      });
      await this.prisma.seatType.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
