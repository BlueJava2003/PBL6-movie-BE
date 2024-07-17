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
}
