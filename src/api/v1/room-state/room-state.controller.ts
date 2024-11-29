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
import { RoomStateService } from './room-state.service';
import { CreateRoomStateDto } from './dto/create-room-state.dto';
import { UpdateRoomStateDto } from './dto/update-room-state.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/api/decorator/role.decorator';
@ApiBearerAuth()
@ApiTags('Room State')
@Controller('room-state')
export class RoomStateController {
  constructor(private readonly roomStateService: RoomStateService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createRoomStateDto: CreateRoomStateDto,
  ): Promise<{ message: string; res: any }> {
    const roomState =
      await this.roomStateService.createRoomState(createRoomStateDto);
    return { message: 'Create successfully!', res: roomState };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<{ message: string; res: any }> {
    const allRoomStates = await this.roomStateService.findAllRoomState();
    return { message: 'Create successfully!', res: allRoomStates };
  }

  @Get(':id')
  async findRoomState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const roomState = await this.roomStateService.findRoomState(+id);
    return { message: 'Found!', res: roomState };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) scheduleId: number,
    @Body() updateRoomStateDto: UpdateRoomStateDto,
  ): Promise<{ message: string; res: any }> {
    const updatedRoomState = await this.roomStateService.updateRoomState(
      scheduleId,
      updateRoomStateDto,
    );
    return { message: 'Update succesfully!', res: updatedRoomState };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) scheduleId: number,
  ): Promise<{ message: string }> {
    await this.roomStateService.removeRoomState(scheduleId);
    return { message: 'Delete succesfully!' };
  }
}
