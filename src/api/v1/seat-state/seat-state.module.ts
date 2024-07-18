import { Module } from '@nestjs/common';
import { SeatStateService } from './seat-state.service';
import { SeatStateController } from './seat-state.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SeatStateController],
  providers: [SeatStateService, PrismaService],
})
export class SeatStateModule {}
