import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { SeatStateService } from './seat-state.service';
import { CreateSeatStateDto } from './dto/create-seat-state.dto';
import { UpdateSeatStateDto } from './dto/update-seat-state.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.gruad';
import { RolesGuard } from '../auth/role.gruad';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from '@prisma/client';
import { CreateManySeatStatesDto } from './dto/create-many-seat-state';

@ApiBearerAuth()
@ApiTags('seat-state')
@Controller('seat-state')
export class SeatStateController {
  constructor(private readonly seatStateService: SeatStateService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createSeatState(
    @Body() createSeatStateDto: CreateSeatStateDto,
  ): Promise<{ message: string; res: any }> {
    const seatState =
      await this.seatStateService.createSeatState(createSeatStateDto);
    return { message: 'Create successfully!', res: seatState };
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('many')
  async createManySeatStates(
    @Body() createManySeatStatesDto: CreateManySeatStatesDto,
  ): Promise<{ message: string; res: any }> {
    const seatState = await this.seatStateService.createManySeatStates(
      createManySeatStatesDto,
    );
    return { message: 'Create successfully!', res: seatState };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAllSeatState(): Promise<{ message: string; res: any }> {
    const allSeatStates = await this.seatStateService.findAllSeatState();
    return { message: 'Successfull!', res: allSeatStates };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOneSeatState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const seatState = await this.seatStateService.findOneSeatState(+id);
    return { message: 'Successfull!', res: seatState };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async removeSeatState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    await this.seatStateService.removeSeatState(+id);
    return {
      message: 'Delete successfully!',
      res: null,
    };
  }
}
