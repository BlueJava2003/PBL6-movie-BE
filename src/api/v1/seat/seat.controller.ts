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
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { CreateManySeatsDto } from './dto/create-many-seats.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Seat')
@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createSeat(
    @Body() createSeatDto: CreateSeatDto,
  ): Promise<{ message: string; res: any }> {
    const seat = await this.seatService.createSeat(createSeatDto);
    return { message: 'Create successfully!', res: seat };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('many')
  async createManySeats(
    @Body() createManySeatsDto: CreateManySeatsDto,
  ): Promise<{ message: string; res: any }> {
    const seat = await this.seatService.createManySeats(createManySeatsDto);
    return { message: 'Create successfully!', res: seat };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAllSeat(): Promise<{ message: string; res: any }> {
    const allSeat = await this.seatService.findAllSeat();
    return { message: 'Successfull!', res: allSeat };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOneSeat(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const seat = await this.seatService.findOneSeat(id);
    return { message: 'Successfull!', res: seat };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeatTypeDto: UpdateSeatDto,
  ): Promise<{ message: string; res: any }> {
    const seatUpdated = await this.seatService.updateSeat(
      +id,
      updateSeatTypeDto,
    );
    return { message: 'Updated successfully!', res: seatUpdated };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async removeSeat(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    await this.seatService.removeSeat(id);
    return { message: 'Delete successfully!', res: null };
  }
}
