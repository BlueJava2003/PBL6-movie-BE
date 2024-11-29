import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/prisma.service';
import { RoomStateService } from '../room-state/room-state.service';
import { MailerService } from 'src/api/mailer/mailer.service';
import { PaymentService } from 'src/api/v1/payment/payment.service';
import { PaymentModule } from 'src/api/v1/payment/payment.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, RoomStateService, MailerService],
})
export class BookingModule { }
