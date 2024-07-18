import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeatStateDto } from './dto/create-seat-state.dto';
import { UpdateSeatStateDto } from './dto/update-seat-state.dto';
import { PrismaService } from 'src/prisma.service';
import { SeatState } from '@prisma/client';
import { CreateManySeatStatesDto } from './dto/create-many-seat-state';
import { RoomService } from '../room/room.service';

@Injectable()
export class SeatStateService {
  constructor(private prisma: PrismaService) {}
  async createSeatState(
    createSeatStateDto: CreateSeatStateDto,
  ): Promise<SeatState> {
    try {
      const { roomId, seatId } = createSeatStateDto;
      const isRoomExisted = await this.prisma.room.findUnique({
        where: { id: roomId },
      });
      if (!isRoomExisted)
        throw new HttpException('Room does not exist!', HttpStatus.BAD_REQUEST);
      const isSeatExisted = await this.prisma.seat.findUnique({
        where: { id: seatId },
      });

      if (!isSeatExisted)
        throw new HttpException('Seat does not exist!', HttpStatus.BAD_REQUEST);

      const isSeatStateExisted = await this.prisma.seatState.findUnique({
        where: {
          roomId_seatId: {
            roomId,
            seatId,
          },
        },
      });
      if (isSeatStateExisted) {
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

  async createManySeatStates(
    createManySeatStatesDto: CreateManySeatStatesDto,
  ): Promise<SeatState[]> {
    try {
      const { roomId, seatIds } = createManySeatStatesDto;
      const seatStatesObj = seatIds.map((seatId) => ({
        roomId: roomId,
        seatId: seatId,
      }));
      const seatState = await this.prisma.seatState.createManyAndReturn({
        data: seatStatesObj,
      });
      return seatState;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllSeatState(): Promise<SeatState[]> {
    try {
      const allSeatStates = await this.prisma.seatState.findMany({
        include: {
          room: true,
          seat: true,
        },
      });
      return allSeatStates;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneSeatState(id: number): Promise<SeatState> {
    try {
      const seatState = await this.prisma.seatState.findUnique({
        where: { id },
        include: {
          room: true,
          seat: true,
        },
      });
      return seatState;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeSeatState(id: number): Promise<void> {
    try {
      const isSeatStateExisted = await this.prisma.seatState.findUnique({
        where: { id },
      });
      if (!isSeatStateExisted)
        throw new HttpException(
          'Seat State not found!',
          HttpStatus.BAD_REQUEST,
        );
      await this.prisma.seatState.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
