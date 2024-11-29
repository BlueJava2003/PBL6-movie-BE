import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from 'src/prisma.service';
import { BookingService } from 'src/api/v1/booking/booking.service';

@Module({
  controllers: [PaymentController],
  providers: [PrismaService, PaymentService],
})
export class PaymentModule { }
