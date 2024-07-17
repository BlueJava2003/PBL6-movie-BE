import { AuthGuard } from './../auth/auth.gruad';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SeatTypeService } from './seat-type.service';
import { CreateSeatTypeDto } from './dto/create-seat-type.dto';
import { UpdateSeatTypeDto } from './dto/update-seat-type.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/role.gruad';
import { Role } from '@prisma/client';
import { Roles } from 'src/api/decorator/role.decorator';

@ApiBearerAuth()
@Controller('seat-type')
@ApiTags('seat-type')
export class SeatTypeController {
  constructor(private readonly seatTypeService: SeatTypeService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createSeatTypeDto: CreateSeatTypeDto,
  ): Promise<{ message: string; res: any }> {
    const seat = await this.seatTypeService.createSeat(createSeatTypeDto);
    return { message: 'Create successfully!', res: seat };
  }
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<{ message: string; res: any }> {
    const allSeats = await this.seatTypeService.findAllSeat();
    return { message: 'Successfull!', res: allSeats };
  }
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const seat = await this.seatTypeService.findOne(+id);
    return { message: 'Successfull!', res: seat };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeatTypeDto: UpdateSeatTypeDto,
  ): Promise<{ message: string; res: any }> {
    const seatUpdated = await this.seatTypeService.updateSeat(
      +id,
      updateSeatTypeDto,
    );
    return { message: 'Updated successfully!', res: seatUpdated };
  }
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    await this.seatTypeService.removeSeat(id);
    return { message: 'Delete successfully!', res: null };
  }
}
