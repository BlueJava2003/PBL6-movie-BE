import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '../auth/auth.gruad';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentBookingDto } from './dto/payment-booking.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/api/decorator/role.decorator';
import { RolesGuard } from '../auth/role.gruad';

@ApiBearerAuth()
@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(200)
  async createBooking(
    @Req() req,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<{ message: string; res: any }> {
    const booking = await this.bookingService.createBooking(
      req.payload.id,
      createBookingDto,
    );
    return { message: 'Create successfully!', res: booking };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Get('admin/all')
  async findAllBooking(): Promise<{ message: string; res: any }> {
    const allBookings = await this.bookingService.findAllHistory();
    return { message: 'Successfull!', res: allBookings };
  }

  //Find all bookings of a user (for ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Get('/admin/account/:id')
  async findAllUserBooking(
    @Param('id', ParseIntPipe) accountId,
  ): Promise<{ message: string; res: any }> {
    const allBookings =
      await this.bookingService.findAllUserBookingHistory(accountId);
    return { message: 'Successfull!', res: allBookings };
  }

  //Find detail booking of a user (for ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Get('/admin')
  async findUserBooking(
    @Query('accountId', ParseIntPipe) accountId,
    @Query('bookingId', ParseIntPipe) bookingId,
  ): Promise<{ message: string; res: any }> {
    const booking = await this.bookingService.findUserBookingHistory(
      accountId,
      bookingId,
    );
    return { message: 'Successfull!', res: booking };
  }

  //Find all booking (for USER)
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('all')
  async findAllUserBookingHistory(
    @Req() req,
  ): Promise<{ message: string; res: any }> {
    const accountId = req.payload.id;
    const allBookings =
      await this.bookingService.findAllUserBookingHistory(accountId);
    return { message: 'Successfull!', res: allBookings };
  }

  //Find detail history (for USER)
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get(':id')
  async findUserBookingHistory(
    @Req() req,
    @Param('id', ParseIntPipe) bookingId: number,
  ): Promise<{ message: string; res: any }> {
    const accountId = req.payload.id;
    const booking = await this.bookingService.findUserBookingHistory(
      accountId,
      bookingId,
    );
    return { message: 'Successfull!', res: booking };
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateBooking(
    @Param('id', ParseIntPipe) bookingId: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<{ message: string; res: any }> {
    const updatedBooking = await this.bookingService.updateBooking(
      bookingId,
      updateBookingDto,
    );
    return { message: 'Successfull!', res: updatedBooking };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteBooking(
    @Param('id', ParseIntPipe) bookingId: number,
  ): Promise<{ message: string }> {
    await this.bookingService.remove(bookingId);
    return { message: 'Successfull!' };
  }
}
