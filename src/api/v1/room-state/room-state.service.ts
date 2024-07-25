import { scheduled } from 'rxjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomStateDto } from './dto/create-room-state.dto';
import { UpdateRoomStateDto } from './dto/update-room-state.dto';
import { PrismaService } from 'src/prisma.service';
import { RoomState } from '@prisma/client';
import { RoomStateResponseDto } from './dto/room-state-response.dto';
import { compareFn } from 'src/api/util/sortSeats';

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
      const allRoomStates = await this.prisma.roomState.findMany();
      return allRoomStates;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Find a room states by Schedule ID (for user mostly)
  async findRoomState(scheduledId: number): Promise<{}> {
    try {
      const roomState = await this.prisma.roomState.findFirst({
        where: {
          scheduleId: scheduledId,
        },
        select: {
          availableSeat: true,
          unavailableSeat: true,
          room: {
            select: { id: true, roomName: true },
          },
        },
      });
      if (!roomState)
        throw new HttpException(
          'Room State Not Found!',
          HttpStatus.BAD_REQUEST,
        );
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
      const seats = [...availArray, ...unavailArray];
      seats.sort(compareFn);
      return { room: roomState.room, seats: seats };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Update a room state
  async updateRoomState(
    schduleId: number,
    updateRoomStateDto: UpdateRoomStateDto,
  ) {
    try {
      const roomState = await this.prisma.roomState.findUnique({
        where: { scheduleId: schduleId },
        select: { availableSeat: true },
      });

      if (!roomState) {
        throw new HttpException(
          'Room state not found for this schedule!',
          HttpStatus.BAD_GATEWAY,
        );
      }
      //Check if seats are in available array
      const verifySeats = updateRoomStateDto.seatIds.every((id) =>
        roomState.availableSeat.includes(id),
      );
      if (!verifySeats) {
        throw new HttpException(
          "At least one seat isn't available!",
          HttpStatus.BAD_REQUEST,
        );
      }

      //Filter out seats need to be reserved
      const updatedSeats = roomState.availableSeat.filter(
        (seatId) => !updateRoomStateDto.seatIds.includes(seatId),
      );
      const updatedRoomState = await this.prisma.roomState.update({
        where: { scheduleId: schduleId },
        data: {
          availableSeat: updatedSeats,
          unavailableSeat: {
            push: updateRoomStateDto.seatIds,
          },
        },
      });
      return updatedRoomState;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeRoomState(scheduleId: number): Promise<void> {
    try {
      const roomState = await this.prisma.roomState.findUnique({
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
