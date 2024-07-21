import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/prisma.service';
import { RoomStateService } from '../room-state/room-state.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, RoomStateService],
})
export class BookingModule {}
