import { Module } from '@nestjs/common';
import { RoomStateService } from './room-state.service';
import { RoomStateController } from './room-state.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RoomStateController],
  providers: [RoomStateService, PrismaService],
})
export class RoomStateModule {}
