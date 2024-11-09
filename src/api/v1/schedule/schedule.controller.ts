import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.gruad';
import { RolesGuard } from '../auth/role.gruad';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from '@prisma/client';
import { CreateScheduleDTO } from './dto/createSchedule.dto';
import { UpdateScheduleDTO } from './dto/updateSchedule.dto';

@ApiBearerAuth()
@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {

  constructor(private readonly ScheduleService: ScheduleService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('createSchedule')
  @HttpCode(200)
  async createSchedule(@Body() body: CreateScheduleDTO): Promise<{ message: string; res: any }> {
    const result = await this.ScheduleService.createSchedule(body);
    return { message: 'Create Schedule movie successfully', res: result };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('updateSchedule/:id')
  @HttpCode(200)
  async updateSchedule(@Body() body: UpdateScheduleDTO, @Param('id', ParseIntPipe) id: number): Promise<{ message: string; res: any }> {
    const result = await this.ScheduleService.updateSchedule(id, body);
    return { message: 'Update Schedule movie successfully', res: result };
  }

  @Get('getAllSchedule')
  @HttpCode(200)
  async getAllSchedule(): Promise<{ message: string; res: any }> {
    const result = await this.ScheduleService.getAllSchedule();
    return { message: 'Get list Schedule movie successfully', res: result };
  }

  @Get('getScheduleId/:id')
  @HttpCode(200)
  async getScheduleId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; res: any }> {
    const result = await this.ScheduleService.getScheduleId(id);
    return { message: `Get Schedule movie id ${id} successfully`, res: result };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('deleteSchedule/:id')
  @HttpCode(200)
  async deleteSchedule(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.ScheduleService.deleteSchedule(id);
    return { message: `Delete Schedule movie id ${id} successfully` };
  }
}
