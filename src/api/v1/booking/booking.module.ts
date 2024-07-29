import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/prisma.service';
import { RoomStateService } from '../room-state/room-state.service';
import { MailerService } from 'src/api/mailer/mailer.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, RoomStateService, MailerService],
})
export class BookingModule {}
