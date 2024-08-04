import { Module } from '@nestjs/common';
import { GenaraterDataController } from './genarater-data.controller';
import { GenaraterDataService } from './genarater-data.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [GenaraterDataController],
  providers: [GenaraterDataService, PrismaService],
})
export class GenaraterDataModule {}
