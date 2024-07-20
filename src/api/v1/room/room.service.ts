import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma.service';
import { Room } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  //Create a room
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const room = await this.prisma.room.create({
        data: createRoomDto,
      });
      return room;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Find all room existed
  async findAllRooms(): Promise<Room[]> {
    try {
      const allRooms = await this.prisma.room.findMany();
      return allRooms;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Find a room by ID
  async findOneRoom(id: number): Promise<Room> {
    try {
      const room = await this.prisma.room.findUnique({ where: { id } });
      return room;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //Update room info
  async updateRoom(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    try {
      const updatedRoom = await this.prisma.room.update({
        where: { id },
        data: updateRoomDto,
      });
      return updatedRoom;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeRoom(id: number): Promise<void> {
    try {
      await this.prisma.roomState.deleteMany({ where: { roomId: id } });
      await this.prisma.room.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
