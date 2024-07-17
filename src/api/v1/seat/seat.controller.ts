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
}
