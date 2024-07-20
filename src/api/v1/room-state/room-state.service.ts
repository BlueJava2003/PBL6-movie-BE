import { scheduled } from 'rxjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomStateDto } from './dto/create-room-state.dto';
import { UpdateRoomStateDto } from './dto/update-room-state.dto';
import { PrismaService } from 'src/prisma.service';
import { RoomState } from '@prisma/client';
import { RoomStateResponseDto } from './dto/room-state-response.dto';

@Injectable()
export class RoomStateService {
  constructor(private prisma: PrismaService) {}

  //Create a room state with all seats exist
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
  //Find all room states exist
  async findAllRoomState(): Promise<RoomState[]> {
    try {
      const allRoomStates = this.prisma.roomState.findMany();
      return allRoomStates;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Find a room states by Schedule ID (for user mostly)
  async findRoomState(scheduledId: number): Promise<{
    availableSeats: RoomStateResponseDto[];
    unavailableSeats: RoomStateResponseDto[];
  }> {
    try {
      const roomState = await this.prisma.roomState.findFirst({
        where: {
          scheduleId: scheduledId,
        },
      });
      if (!roomState)
        throw new HttpException('Schedule Not Found!', HttpStatus.BAD_REQUEST);
      const availableSeats = await this.prisma.seat.findMany({
        where: {
          id: {
            in: roomState.availableSeat,
          },
        },
        include: {
          seatType: true,
        },
      });
      const unavailableSeats = await this.prisma.seat.findMany({
        where: {
          id: {
            in: roomState.unavailableSeat,
          },
        },
        include: {
          seatType: true,
        },
      });

      const availArray = availableSeats.map((seat) => ({
        seatId: seat.id,
        name: seat.name,
        type: seat.seatType.name,
        price: seat.seatType.price,
        isReserved: false,
      }));
      const unavailArray = unavailableSeats.map((seat) => ({
        seatId: seat.id,
        name: seat.name,
        type: seat.seatType.name,
        price: seat.seatType.price,
        isReserved: true,
      }));
      return { availableSeats: availArray, unavailableSeats: unavailArray };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Delete a room state
  async update(schduleId: number, updateRoomStateDto: UpdateRoomStateDto) {
    try {
      const roomState = await this.prisma.roomState.findUnique({
        where: { scheduleId: schduleId },
        select: { availableSeat: true },
      });

      if (!roomState) {
        throw new HttpException('Room state not found', HttpStatus.BAD_GATEWAY);
      }
      const updatedSeats = roomState.availableSeat.filter(
        (seatId) => !updateRoomStateDto.seatIds.includes(seatId),
      );
      await this.prisma.roomState.update({
        where: { scheduleId: schduleId },
        data: {
          availableSeat: updatedSeats,
        },
      });
      await this.prisma.roomState.update({
        where: { scheduleId: schduleId },
        data: {
          unavailableSeat: {
            push: updateRoomStateDto.seatIds,
          },
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeRoomState(scheduleId: number): Promise<void> {
    try {
      const roomState = this.prisma.roomState.findUnique({
        where: {
          scheduleId,
        },
      });
      if (!roomState)
        throw new HttpException('No schedule found!', HttpStatus.BAD_REQUEST);
      await this.prisma.roomState.delete({ where: { scheduleId } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
