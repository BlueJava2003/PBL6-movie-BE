import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category_movie } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createCategoryDTO } from './dto/createCategory.dto';
import { updateCategoryDTO } from './dto/updateCategory.dto';
import { getCategoryMovieDTO } from './dto/getCategoryMovie.dto';

@Injectable()
export class CategoryMovieService {
  constructor(private readonly prisma: PrismaService) {}
  //create category
  async createCategoryMovie(data: createCategoryDTO): Promise<Category_movie> {
    try {
      const check = await this.prisma.category_movie.findFirst({
        where: {
          name: data.name,
        },
      });
      if (check)
        throw new HttpException('Name already exist!', HttpStatus.BAD_REQUEST);
      const result = await this.prisma.category_movie.create({
        data: { ...data },
      });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  //get all category
  async getAllCategoryMovie(): Promise<getCategoryMovieDTO[]> {
    try {
      const result = await this.prisma.category_movie.findMany({
        select: {
          id: true,
          name: true,
          desc: true,
          movie: {
            select: {
              id: true,
              name: true,
              duration: true,
              releaseDate: true,
              desc: true,
              director: true,
              actor: true,
              language: true,
              urlTrailer: true,
              imagePath: true,
            },
          },
        },
        where: {
          delete_at: false,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  //get category id
  async getCategoryMovieId(id: number): Promise<getCategoryMovieDTO> {
    try {
      const result = await this.prisma.category_movie.findUnique({
        select: {
          id: true,
          name: true,
          desc: true,
          movie: {
            select: {
              id: true,
              name: true,
              duration: true,
              releaseDate: true,
              desc: true,
              director: true,
              actor: true,
              language: true,
              urlTrailer: true,
              imagePath: true,
            },
          },
        },
        where: {
          id: id,
          delete_at: false,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  // update category
  async updateCategoryMovie(
    updateDate: updateCategoryDTO,
    id: number,
  ): Promise<Category_movie> {
    try {
      const exited = await this.getCategoryById(id);
      if (!exited)
        throw new HttpException('id not found', HttpStatus.BAD_REQUEST);
      const result = await this.prisma.category_movie.update({
        where: {
          id: id,
          delete_at: false,
        },
        data: {
          ...updateDate,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  //delete category
  async deleteCategoryMovie(id: number): Promise<void> {
    try {
      const exited = await this.getCategoryById(id);
      if (!exited)
        throw new HttpException('id not found', HttpStatus.BAD_REQUEST);
      await this.prisma.category_movie.update({
        where: {
          id: id,
        },
        data: {
          delete_at: true,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getCategoryById(id: number): Promise<{ id: number }> {
    const userId = await this.prisma.category_movie.findUnique({
      where: {
        id: id,
        delete_at: false,
      },
    });
    return userId;
  }
}
