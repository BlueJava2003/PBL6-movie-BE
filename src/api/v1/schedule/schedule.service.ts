import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateScheduleDTO } from './dto/createSchedule.dto';
import { UpdateScheduleDTO } from './dto/updateSchedule.dto';
import { GetScheduleDTO } from './dto/getSchedule.dto';
import { scheduled } from 'rxjs';
import { formatToVietnamDay, formatToVietnamTime } from 'src/api/utils/formatDate';


@Injectable()
export class ScheduleService {
    constructor(private readonly prisma:PrismaService){}

    dateToSeconds(timeStart: Date, timeEnd: Date): number {
        const currentTimestamp = Math.floor(new Date().getTime() / 1000);
        const start = Math.floor(timeStart.getTime() / 1000);
        const end = Math.floor(timeEnd.getTime() / 1000);
      
        if (start >= end) {
          throw new HttpException(`TimeStart is not allowed to be greater than or equal to timeEnd`, HttpStatus.BAD_REQUEST);
        }
      
        if (start < currentTimestamp || end < currentTimestamp) {
          throw new HttpException(`TimeStart and timeEnd must be greater than or equal to the current time`, HttpStatus.BAD_REQUEST);
        }
      
        return end - start;
      }

    //create Schedule
    async createSchedule(data: CreateScheduleDTO): Promise<Schedule> {
        try {
          const { timeStart, timeEnd, movieId, date } = data;
          const check = this.dateToSeconds(timeStart,timeEnd) / 60;
          const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
          if(check < movie.duration || check > movie.duration + 10){
            throw new HttpException(`Create Schedule invalid`, HttpStatus.BAD_REQUEST);
          }

          if (!movie) {
            throw new HttpException(`Movie id not found`, HttpStatus.BAD_REQUEST);
          }
      
          const existingSchedules = await this.prisma.schedule.findMany({
            where: {
              movieId,
              date,
              OR: [
                {
                  timeStart: {
                    lte: timeEnd,
                  },
                  timeEnd: {
                    gte: timeStart,
                  },
                },
                {
                  timeStart: {
                    gte: timeStart,
                    lte: timeEnd,
                  },
                },
              ],
            },
          });
      
          if (existingSchedules.length > 0) {
            throw new HttpException(`There is an overlapping schedule for this movie on the same day`, HttpStatus.BAD_REQUEST);
          }
      
          // Create the new schedule
          const result = await this.prisma.schedule.create({ data: { ...data } });
          return result;
        } catch (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
      }

    //get all Schedule
    async getAllSchedule(): Promise<GetScheduleDTO[]> {
        try {
          const result = await this.prisma.schedule.findMany({
            select: {
              id: true,
              date: true,
              timeStart: true,
              timeEnd: true,
              movie: {
                select: {
                  id: true,
                  name: true,
                  duration: true,
                  releaseDate: true,
                  desc: true,
                  categoryId: true,
                  director: true,
                  actor: true,
                  language: true,
                  urlTrailer: true,
                  imagePath: true,
                }
              },
            },
            where: {
              deleteAt: false
            }
          });
      
          const schedule = result.map((sch) => ({
            ...sch,
            date: formatToVietnamDay(sch.date),
            timeStart: formatToVietnamTime(sch.timeStart),
            timeEnd: formatToVietnamTime(sch.timeEnd),
          }));
      
          return schedule;
        } catch (error) {
          throw new HttpException(
            error.message || 'An error occurred while fetching schedules',
            HttpStatus.BAD_REQUEST
          );
        }
      }

    //get Schedule id
    async getScheduleId(id:number):Promise<GetScheduleDTO>{
        try {
            const result = await this.prisma.schedule.findUnique({
                select:{
                    id:true,
                    date:true,
                    timeStart:true,
                    timeEnd:true,
                    movie:{
                        select:{
                            id:true,
                            name:true,
                            duration:true,
                            releaseDate:true,
                            desc:true,
                            categoryId : true,
                            director: true,
                            actor: true,
                            language:true,
                            urlTrailer:true,
                            imagePath: true,
                        }
                    }
                },
                where:{
                    id:id,
                    deleteAt:false
                }
            })
            const schedule = {
                ...result,
                date:formatToVietnamDay(result.date),
                timeStart: formatToVietnamTime(result.timeStart),
                timeEnd: formatToVietnamTime(result.timeEnd),
            };
            return schedule;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
    }

    // update Schedule 
    async updateSchedule(updateDate: UpdateScheduleDTO,id:number):Promise<Schedule>{
        try {
            const exited = await this.getScheduleById(id);
            if(!exited)
                throw new HttpException('id not found',HttpStatus.BAD_REQUEST)
            const result = await this.prisma.schedule.update({
                where:{
                    id:id,
                    deleteAt:false
                },
                data:{
                    ...updateDate
                }
            })
            return result;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
    }

    //delete Schedule
    async deleteSchedule(id:number):Promise<void>{
        try {
            const exited = await this.getScheduleById(id);
            if(!exited)
                throw new HttpException('id not found',HttpStatus.BAD_REQUEST)
            await this.prisma.schedule.update({
                where:{
                    id:id
                },data:{
                    deleteAt:true
                }
            })
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
        
    }

    async getScheduleById(id:number): Promise< {id:number} >{
        const userId = await this.prisma.schedule.findUnique({
            where:{
                id:id,
                deleteAt:false
            }
        });
        return userId;
    }
}
