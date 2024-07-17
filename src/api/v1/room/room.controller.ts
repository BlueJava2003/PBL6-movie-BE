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
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<{ message: string; res: any }> {
    const room = await this.roomService.createRoom(createRoomDto);
    return { message: 'Create successfully!', res: room };
  }

  @Get()
  async findAll(): Promise<{ message: string; res: any }> {
    const allRooms = await this.roomService.findAllRooms();
    return { message: 'Successfull!', res: allRooms };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const room = await this.roomService.findOneRoom(+id);
    return { message: 'Successfull!', res: room };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<{ message: string; res: any }> {
    const updatedRoom = await this.roomService.updateRoom(+id, updateRoomDto);
    return { message: 'Updated successfully!', res: updatedRoom };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
