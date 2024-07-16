import { Module } from '@nestjs/common';
import { CategoryMovieController } from './category-movie.controller';
import { CategoryMovieService } from './category-movie.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CategoryMovieController],
  providers: [CategoryMovieService,PrismaService]
})
export class CategoryMovieModule {}
