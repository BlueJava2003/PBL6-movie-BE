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
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { CreateManySeatsDto } from './dto/create-many-seats.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}
  @Post()
  async createSeat(
    @Body() createSeatDto: CreateSeatDto,
  ): Promise<{ message: string; res: any }> {
    const seat = await this.seatService.createSeat(createSeatDto);
    return { message: 'Create successfully!', res: seat };
  }
  @Post('/many')
  async createManySeats(
    @Body() createManySeatsDto: CreateManySeatsDto,
  ): Promise<{ message: string; res: any }> {
    const seat = await this.seatService.createManySeats(createManySeatsDto);
    return { message: 'Create successfully!', res: seat };
  }
  @Get()
  async findAllSeat(): Promise<{ message: string; res: any }> {
    const allSeat = await this.seatService.findAllSeat();
    return { message: 'Successfull!', res: allSeat };
  }
  @Get(':id')
  async findOneSeat(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const seat = await this.seatService.findOneSeat(id);
    return { message: 'Successfull!', res: seat };
  }
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
  @Delete(':id')
  async removeSeat(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    await this.seatService.removeSeat(id);
    return { message: 'Delete successfully!', res: null };
  }
  @Delete('/all')
  async removeAllSeat(): Promise<{ message: string; res: any }> {
    await this.seatService.removeAllSeat();
    return { message: 'Delete successfully!', res: null };
  }
}
