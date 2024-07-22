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

  @UseGuards(AuthGuard)
  @Post('/payment')
  @HttpCode(200)
  async processPayment(
    @Req() req,
    @Body() paymentDto: PaymentBookingDto,
  ): Promise<{ message: string; res: any }> {
    const booking = await this.bookingService.processPayment(
      req.payload.id,
      paymentDto,
    );
    return { message: 'Payment success!', res: booking };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Get()
  async findAllBooking(): Promise<{ message: string; res: any }> {
    const allBookings = await this.bookingService.findAll();
    return { message: 'Successfull!', res: allBookings };
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('user')
  async findAllUserBookingHistory(
    @Req() req,
  ): Promise<{ message: string; res: any }> {
    const accountId = req.payload.id;
    const allBookings =
      await this.bookingService.findAllUserBookingHistory(accountId);
    return { message: 'Successfull!', res: allBookings };
  }

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
  async update(
    @Param('id', ParseIntPipe) bookingId: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<{ message: string; res: any }> {
    const updatedBooking = await this.bookingService.update(
      bookingId,
      updateBookingDto,
    );
    return { message: 'Successfull!', res: updatedBooking };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
