import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatTypeDto } from './dto/create-seat-type.dto';
import { UpdateSeatTypeDto } from './dto/update-seat-type.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SeatTypeService {
  constructor(private prisma: PrismaService) {}
  async createSeat(createSeatTypeDto: CreateSeatTypeDto) {
    try {
      const seat = await this.prisma.seatType.create({
        data: createSeatTypeDto,
      });
      return seat;
    } catch (err) {
      throw new HttpException('Create fail!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllSeat() {
    try {
      const allSeats = await this.prisma.seatType.findMany();
      return allSeats;
    } catch (err) {
      throw new HttpException(
        'Something wrong happend!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const seat = await this.prisma.seatType.findUnique({ where: { id } });
      return seat;
    } catch (err) {
      throw new HttpException(
        'Something wrong happend!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSeat(id: number, updateSeatTypeDto: UpdateSeatTypeDto) {
    try {
      const seatType = await this.prisma.seatType.findUnique({
        where: { id },
      });
      if (!seatType) throw new NotFoundException('Seat Type Not Found!');
      const updatedSeat = await this.prisma.seatType.update({
        where: { id },
        data: updateSeatTypeDto,
      });
      return updatedSeat;
    } catch (err) {
      throw new HttpException('Update failed!', HttpStatus.CONFLICT);
    }
  }

  async removeSeat(id: number) {
    try {
      const seatType = await this.prisma.seatType.findUnique({ where: { id } });
      if (!seatType) throw new NotFoundException('Seat Type Not Found!');
      await this.prisma.seat.deleteMany({
        where: {
          seatTypeId: id,
        },
      });
      await this.prisma.seatType.delete({ where: { id } });
    } catch (err) {
      throw new HttpException('Delete failed', HttpStatus.CONFLICT);
    }
  }
}
