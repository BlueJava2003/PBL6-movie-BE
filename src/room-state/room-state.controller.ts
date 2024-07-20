import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  findAll() {
    return this.roomStateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomStateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomStateDto: UpdateRoomStateDto,
  ) {
    return this.roomStateService.update(+id, updateRoomStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomStateService.remove(+id);
  }
}
