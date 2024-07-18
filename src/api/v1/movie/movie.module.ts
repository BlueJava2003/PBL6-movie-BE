import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryModule } from 'src/api/cloudinary/cloudinary.module';

@Module({
  imports:[CloudinaryModule],
  controllers: [MovieController],
  providers: [MovieService,PrismaService]
})
export class MovieModule {}
