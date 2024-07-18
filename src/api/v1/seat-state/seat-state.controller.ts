import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeatStateService } from './seat-state.service';
import { CreateSeatStateDto } from './dto/create-seat-state.dto';
import { UpdateSeatStateDto } from './dto/update-seat-state.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('seat-state')
@Controller('seat-state')
export class SeatStateController {
  constructor(private readonly seatStateService: SeatStateService) {}

  @Post()
  async createSeatState(
    @Body() createSeatStateDto: CreateSeatStateDto,
  ): Promise<{ message: string; res: any }> {
    const seatState =
      await this.seatStateService.createSeatState(createSeatStateDto);
    return { message: 'Create successfully!', res: seatState };
  }

  @Get()
  findAll() {
    return this.seatStateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatStateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSeatStateDto: UpdateSeatStateDto,
  ) {
    return this.seatStateService.update(+id, updateSeatStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatStateService.remove(+id);
  }
}
