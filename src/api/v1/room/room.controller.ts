import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

import { RolesGuard } from '../auth/role.gruad';
import { AuthGuard } from '../auth/auth.gruad';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<{ message: string; res: any }> {
    const room = await this.roomService.createRoom(createRoomDto);
    return { message: 'Create successfully!', res: room };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<{ message: string; res: any }> {
    const allRooms = await this.roomService.findAllRooms();
    return { message: 'Successfull!', res: allRooms };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const room = await this.roomService.findOneRoom(+id);
    return { message: 'Successfull!', res: room };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<{ message: string; res: any }> {
    const updatedRoom = await this.roomService.updateRoom(+id, updateRoomDto);
    return { message: 'Updated successfully!', res: updatedRoom };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async removeRoom(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    await this.roomService.removeRoom(id);
    return { message: 'Delete successfully!', res: null };
  }
}
