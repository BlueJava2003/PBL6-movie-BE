import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createMovieDTO } from './dto/createMovie.dto';
import { getMovieDTO } from './dto/getAllMovie.dto';
import { updateMovieDTO } from './dto/updateMovie.dto';
import { Movie } from '@prisma/client';
import { CloudinaryService } from 'src/api/cloudinary/cloudinary.service';
import {
  formatToVietnamDay,
  formatToVietnamTime,
} from 'src/api/utils/formatDate';
import { PaginationService } from 'src/api/util/paginination';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly pagination :PaginationService,
  ) {}

  //create Movie
  async createMovie(
    data: createMovieDTO,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      const urlCloudynary = await this.cloudinaryService.uploadFile(
        file,
        process.env.FOLDER_CLOUDYNARY,
      );
      const imagePath = urlCloudynary.secure_url;
      var imageId = urlCloudynary.public_id;
      const check = await this.prisma.category_movie.findUnique({
        where: {
          id: data.categoryId,
        },
      });
      if (!check)
        throw new HttpException(
          'Id category-movie not found',
          HttpStatus.BAD_REQUEST,
        );
      const result = await this.prisma.movie.create({
        data: { ...data, imageId, imagePath },
      });
      return result;
    } catch (error) {
      if (error) {
        await this.cloudinaryService.deleteFile(imageId);
      }
      throw new HttpException(data, HttpStatus.BAD_REQUEST);
    }
  }

  //get all Movie
  async getAllMovie(page?: number, limit?: number | 10, orderBy?: string, option?:string): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 59);
      let where: any = {
        deleteAt: false,
      };
  
      if (option === 'today') {
        where.schedule = {
          some: {
            date: {
              gte: startDate,
              lte: endDate
            }
          }
        };
      } else if (option === 'upcoming') {
        where.schedule = {
          some: {
            date: {
              gt: endDate
            }
          }
        };
      }
  
      const select = {
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
        category: {
          select: {
            id: true,
            name: true,
            desc: true,
          },
        },
        schedule: {
          select: {
            id: true,
            date: true,
            timeStart: true,
            timeEnd: true,
          },
        },
      };
  
      const sortDate= {
        createAt: orderBy,
      };
  
      const result = await this.pagination.paginate<Movie>("movie", { page, limit }, where, select, sortDate);
  
      const resultArray = Object.values(result);
      const test = resultArray.flat().map(movie => ({
        ...movie,
        schedule: movie.schedule?.map((sch) => ({
          ...sch,
          date: formatToVietnamDay(sch.date),
          timeStart: formatToVietnamTime(sch.timeStart),
          timeEnd: formatToVietnamTime(sch.timeEnd),
        }))
      }));
  
      return test;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //get Movie id
  async getMovieId(id: number): Promise<getMovieDTO> {
    try {
      const result = await this.prisma.movie.findUnique({
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
          category: {
            select: {
              id: true,
              name: true,
              desc: true,
            },
          },
          schedule: {
            select: {
              id: true,
              date: true,
              timeStart: true,
              timeEnd: true,
            },
          },
        },
        where: {
          id: id,
          deleteAt: false,
        },
      });

      if (!result)
        throw new HttpException('id not found', HttpStatus.BAD_REQUEST);
        const newResult = {
            ...result,
            schedule: result.schedule.map((data) => ({
                ...data,
                date: formatToVietnamDay(data.date),
                timeStart: formatToVietnamTime(data.timeStart),
                timeEnd: formatToVietnamTime(data.timeEnd),
            }))
        }

      return newResult;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //get all movie follow day
  async getAllMovieFollowDay(
    date: Date,
    MovieId: number,
  ): Promise<getMovieDTO[]> {
    try {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      const whereCondition: any = {
        schedule: {
          some: {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
            deleteAt: false,
          },
        },
        deleteAt: false,
      };

      if (MovieId !== undefined) {
        whereCondition.id = MovieId;
      }

      const movies = await this.prisma.movie.findMany({
        where: whereCondition,
        include: {
          schedule: {
            where: {
              date: {
                gte: startOfDay,
                lte: endOfDay,
              },
              deleteAt: false,
            },
            select: {
              id: true,
              date: true,
              timeStart: true,
              timeEnd: true,
            },
            orderBy:{
              createdAt:'desc'
            }
          },
          category: true,
        },
        
      });
      const newResult = movies.map((movie) => ({
        ...movie,
        schedule: movie.schedule.map((sch) => ({
          ...sch,
          date: formatToVietnamDay(sch.date),
          timeStart: formatToVietnamTime(sch.timeStart),
          timeEnd: formatToVietnamTime(sch.timeEnd),
        })),
      }));
      return newResult;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getDailyDates() {
    const currentDate = new Date();
    const dates = [];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(date);
    }
  
    return dates;
  }

  // update Movie
  async updateMovie(
    updateData: updateMovieDTO,
    id: number,
    file?: Express.Multer.File,
  ): Promise<Movie> {
    try {
      const exited = await this.getMovieById(id);
      if (!exited)
        throw new HttpException('id not found', HttpStatus.BAD_REQUEST);
      if (file) {
        await this.cloudinaryService.deleteFile(exited.imageId);
        const urlCloudynary = await this.cloudinaryService.uploadFile(
          file,
          process.env.FOLDER_CLOUDYNARY,
        );
        const imagePath = urlCloudynary.secure_url;
        var imageId = urlCloudynary.public_id;
        const res = await this.prisma.movie.update({
          where: {
            id: id,
          },
          data: {
            ...updateData,
            imageId,
            imagePath,
          },
        });
        return res;
      }
      const result = await this.prisma.movie.update({
        where: {
          id: id,
          deleteAt: false,
        },
        data: {
          ...updateData,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //delete Movie
  async deleteMovie(id: number): Promise<void> {
    try {
      const exited = await this.getMovieById(id);
      var imageId = exited.imageId;
      if (!exited)
        throw new HttpException('id not found', HttpStatus.BAD_REQUEST);
      await Promise.all([
        this.cloudinaryService.deleteFile(imageId),
        this.prisma.movie.update({
          where: { id: id },
          data: { deleteAt: true },
        }),
      ]);
    } catch (error) {
      if (error) {
        await this.cloudinaryService.deleteFile(imageId);
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //search movie
  async searchMovie(name: string): Promise<getMovieDTO[]> {
    const result = await this.prisma.movie.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        deleteAt: false,
      },
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
        category: {
          select: {
            id: true,
            name: true,
            desc: true,
          },
        },
        schedule: {
          select: {
            id: true,
            date: true,
            timeStart: true,
            timeEnd: true,
          },
        },
      },
    });
    if (!result) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return result;
  }

  async getMovieById(id: number): Promise<Movie> {
    const userId = await this.prisma.movie.findUnique({
      where: {
        id: id,
        deleteAt: false,
      },
    });
    return userId;
  }
}
