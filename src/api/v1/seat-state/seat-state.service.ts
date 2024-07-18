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
      const { roomId, seatId } = createSeatStateDto;
      const isSeatExisted = await this.prisma.seatState.findUnique({
        where: {
          roomId_seatId: {
            roomId,
            seatId,
          },
        },
      });
      if (isSeatExisted) {
        throw new HttpException('Seat State existed!', HttpStatus.BAD_REQUEST);
      }
      const seatState = await this.prisma.seatState.create({
        data: createSeatStateDto,
      });
      return seatState;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllSeatState(): Promise<SeatState[]> {
    try {
      const allSeatStates = await this.prisma.seatState.findMany();
      return allSeatStates;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneSeatState(id: number): Promise<SeatState> {
    try {
      const seatState = await this.prisma.seatState.findUnique({
        where: { id },
      });
      return seatState;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSeatState(
    id: number,
    updateSeatStateDto: UpdateSeatStateDto,
  ): Promise<SeatState> {
    try {
      const seatState = await this.findOneSeatState(id);
      if (!seatState)
        throw new HttpException(
          'Seat State Not Found!',
          HttpStatus.BAD_REQUEST,
        );
      const updatedSeat = await this.prisma.seatState.update({
        where: { id },
        data: updateSeatStateDto,
      });
      return updatedSeat;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async removeSeatState(id: number): Promise<void> {
    try {
      await this.prisma.seatState.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
