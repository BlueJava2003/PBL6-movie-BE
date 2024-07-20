import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomStateDto } from './dto/create-room-state.dto';
import { UpdateRoomStateDto } from './dto/update-room-state.dto';
import { PrismaService } from 'src/prisma.service';
import { RoomState } from '@prisma/client';

@Injectable()
export class RoomStateService {
  constructor(private prisma: PrismaService) {}
  async createRoomState(
    createRoomStateDto: CreateRoomStateDto,
  ): Promise<RoomState> {
    try {
      const { roomId, scheduleId } = createRoomStateDto;

      const allSeats = await this.prisma.seat.findMany({
        select: { id: true },
      });
      const seatIds = allSeats.map((seat) => seat.id);
      const hasRoomExist = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });
      if (!hasRoomExist) {
        throw new HttpException(
          'Room does not existed!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hasScheduleExist = await this.prisma.schedule.findUniqueOrThrow({
        where: {
          id: scheduleId,
        },
      });
      if (!hasScheduleExist) {
        throw new HttpException(
          'Schudule does not existed!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hasRoomStateExist = await this.prisma.roomState.findFirst({
        where: {
          roomId,
          scheduleId,
        },
      });
      if (hasRoomStateExist) {
        throw new HttpException(
          'Room State does exist!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const roomState = await this.prisma.roomState.create({
        data: {
          roomId: createRoomStateDto.roomId,
          scheduleId: createRoomStateDto.scheduleId,
          availableSeat: seatIds,
        },
      });
      return roomState;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all roomState`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomState`;
  }

  update(id: number, updateRoomStateDto: UpdateRoomStateDto) {
    return `This action updates a #${id} roomState`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomState`;
  }
}
