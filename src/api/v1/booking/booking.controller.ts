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
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '../auth/auth.gruad';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentBookingDto } from './dto/payment-booking.dto';

@ApiBearerAuth()
@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createBooking(
    @Req() req,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<{ message: string; res: any }> {
    console.log(req.payload.id);
    const booking = await this.bookingService.createBooking(
      req.payload.id,
      createBookingDto,
    );
    return { message: 'Create successfully!', res: booking };
  }

  @UseGuards(AuthGuard)
  @Post('/payment')
  async processPayment(
    @Req() req,
    @Body() paymentDto: PaymentBookingDto,
  ): Promise<{ message: string; res: any }> {
    console.log(req.payload.id);
    const booking = await this.bookingService.processPayment(
      req.payload.id,
      paymentDto,
    );
    return { message: 'Payment success!', res: booking };
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
