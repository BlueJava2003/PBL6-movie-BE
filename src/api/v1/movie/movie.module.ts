import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryModule } from 'src/api/cloudinary/cloudinary.module';
import { PaginationService } from 'src/api/util/paginination';

@Module({
  imports: [CloudinaryModule],
  controllers: [MovieController],
  providers: [MovieService, PrismaService, PaginationService],
})
export class MovieModule {}
