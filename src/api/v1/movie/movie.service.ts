import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createMovieDTO } from './dto/createMovie.dto';
import { getMovieDTO } from './dto/getAllMovie.dto';
import { updateMovieDTO } from './dto/updateMovie.dto';
import { Movie } from '@prisma/client';
import { CloudinaryService } from 'src/api/cloudinary/cloudinary.service';


@Injectable()
export class MovieService {
    constructor(private readonly prisma:PrismaService,
        private readonly cloudinaryService:CloudinaryService
    ){}

    //create Movie
    async createMovie(data:createMovieDTO,file: Express.Multer.File):Promise<any>{
        try {
            const urlCloudynary = await this.cloudinaryService.uploadFile(file,process.env.FOLDER_CLOUDYNARY);
            const imagePath = urlCloudynary.secure_url;
            var imageId = urlCloudynary.public_id;
            const check = await this.prisma.category_movie.findUnique({
                where:{
                    id:data.categoryId
                }
            })
            if(!check)
                throw new HttpException('Id category-movie not found',HttpStatus.BAD_REQUEST)
            const result = await this.prisma.movie.create({data:{...data,imageId,imagePath}});
            return result;
        } catch (error) {
            if(error){
                await this.cloudinaryService.deleteFile(imageId);
            }
            throw new HttpException(data,HttpStatus.BAD_REQUEST)
        }
        
    }

    //get all Movie
    async getAllMovie():Promise<getMovieDTO[]>{
        try {
            const result = await this.prisma.movie.findMany({
                select:{
                    id:true,
                    name:true,
                    duration:true,
                    releaseDate:true,
                    desc:true,
                    director: true,
                    actor: true,
                    language:true,
                    urlTrailer:true,
                    category:{
                        select:{
                            id:true,
                            name:true,
                            desc:true,
                        }
                    },
                    schedule:{
                        select: {
                            id: true,
                            date: true,
                            timeStart: true,
                            timeEnd: true,
                            roomId: true,
                          },
                    }
                },
                where:{
                    deleteAt:false
                }
            });
            return result;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
    }

    //get Movie id
    async getMovieId(id:number):Promise<getMovieDTO>{
        try {
            const result = await this.prisma.movie.findUnique({
                select:{
                    id:true,
                    name:true,
                    duration:true,
                    releaseDate:true,
                    desc:true,
                    director: true,
                    actor: true,
                    language:true,
                    urlTrailer:true,
                    category:{
                        select:{
                            id:true,
                            name:true,
                            desc:true,
                        }
                    },
                    schedule:{
                        select: {
                            id: true,
                            date: true,
                            timeStart: true,
                            timeEnd: true,
                            roomId: true,
                          },
                    }
                },
                where:{
                    id:id,
                    deleteAt:false
                }
            })
            if(!result)
                throw new HttpException('id not found',HttpStatus.BAD_REQUEST)
            return result;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
    }

    //get all movie follow day
    async getAllMovieFollowDay(date:Date):Promise<getMovieDTO[]>{
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const movies = await this.prisma.movie.findMany({
                where: {
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
                },
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
                      roomId: true,
                    },
                  },
                  category: true,
                },
              });
        return movies;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
         
    }

    // update Movie 
    async updateMovie(updateData: updateMovieDTO,id:number,file?: Express.Multer.File):Promise<Movie>{
        try {
            const exited = await this.getMovieById(id);
            if(!exited)
                throw new HttpException('id not found',HttpStatus.BAD_REQUEST)
            if(file){
                await this.cloudinaryService.deleteFile(exited.imageId);
                const urlCloudynary = await this.cloudinaryService.uploadFile(file,process.env.FOLDER_CLOUDYNARY);
                const imagePath = urlCloudynary.secure_url;
                var imageId = urlCloudynary.public_id;
                const res = await this.prisma.movie.update({
                    where:{
                        id:id
                    },
                    data:{
                        ...updateData,
                        imageId,
                        imagePath
                    }
                })
                return res
            }
            const result = await this.prisma.movie.update({
                where:{
                    id:id,
                    deleteAt:false
                },
                data:{
                    ...updateData
                }
            })
            return result;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
    }

    //delete Movie
    async deleteMovie(id:number):Promise<void>{
        try {
            const exited = await this.getMovieById(id);
            var imageId = exited.imageId
            if(!exited)
                throw new HttpException('id not found',HttpStatus.BAD_REQUEST)
            await Promise.all([
                this.cloudinaryService.deleteFile(imageId),
                this.prisma.movie.update({
                  where: { id: id },
                  data: { deleteAt: true }
                })
              ]);
        } catch (error) {
            if(error){
                await this.cloudinaryService.deleteFile(imageId);
            }
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
        
    }

    async getMovieById(id:number): Promise< Movie >{
        const userId = await this.prisma.movie.findUnique({
            where:{
                id:id,
                deleteAt:false
            }
        });
        return userId;
    }
}
