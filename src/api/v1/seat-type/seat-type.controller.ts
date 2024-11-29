import { AuthGuard } from '../auth/auth.guard';
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
import { RolesGuard } from '../auth/role.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/api/decorator/role.decorator';

@ApiBearerAuth()
@Controller('seat-type')
@ApiTags('seat-type')
export class SeatTypeController {
  constructor(private readonly seatTypeService: SeatTypeService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createSeatTypeDto: CreateSeatTypeDto,
  ): Promise<{ message: string; res: any }> {
    const seatType =
      await this.seatTypeService.createSeatType(createSeatTypeDto);
    return { message: 'Create successfully!', res: seatType };
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<{ message: string; res: any }> {
    const allSeatTypes = await this.seatTypeService.findAllSeatType();
    return { message: 'Successfull!', res: allSeatTypes };
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const seatType = await this.seatTypeService.findOneSeatType(+id);
    return { message: 'Successfull!', res: seatType };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeatTypeDto: UpdateSeatTypeDto,
  ): Promise<{ message: string; res: any }> {
    const seatTypeUpdated = await this.seatTypeService.updateSeatType(
      +id,
      updateSeatTypeDto,
    );
    return { message: 'Updated successfully!', res: seatTypeUpdated };
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    await this.seatTypeService.removeSeatType(id);
    return { message: 'Delete successfully!', res: null };
  }
}
