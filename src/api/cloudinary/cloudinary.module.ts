// cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService, PrismaService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
