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
import { RoomStateService } from './room-state.service';
import { CreateRoomStateDto } from './dto/create-room-state.dto';
import { UpdateRoomStateDto } from './dto/update-room-state.dto';

@Controller('room-state')
export class RoomStateController {
  constructor(private readonly roomStateService: RoomStateService) {}

  @Post()
  async create(
    @Body() createRoomStateDto: CreateRoomStateDto,
  ): Promise<{ message: string; res: any }> {
    const roomState = this.roomStateService.createRoomState(createRoomStateDto);
    return { message: 'Create successfully!', res: roomState };
  }

  @Get()
  async findAll(): Promise<{ message: string; res: any }> {
    const allRoomStates = this.roomStateService.findAllRoomState();
    return { message: 'Create successfully!', res: allRoomStates };
  }

  @Get(':id')
  async findRoomState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const roomState = await this.roomStateService.findRoomState(+id);
    return { message: 'Found!', res: roomState };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) scheduleId: number,
    @Body() updateRoomStateDto: UpdateRoomStateDto,
  ): Promise<{ message: string; res: any }> {
    const updatedRoomState = await this.roomStateService.update(
      scheduleId,
      updateRoomStateDto,
    );
    return { message: 'Update succesfully!', res: updatedRoomState };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) scheduleId: number) {
    this.roomStateService.removeRoomState(scheduleId);
    return { message: 'Delete succesfully!' };
  }
}
