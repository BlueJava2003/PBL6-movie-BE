import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GenaraterDataService {
    constructor(private prisma: PrismaService) {}

    async createCategory(): Promise<void> {
        for( let i = 0 ; i < 20 ; i++ ){
            await this.prisma.category_movie.create({
                data: {
                  name: `Honor ${i}`,
                  desc: 'phim ma ca la hay qua di',
                },
              });
        }
      }

    async createMovie():Promise<void>{
        for( let i = 0 ; i < 20 ; i++ ){
            await this.prisma.movie.create({
                data: {
                    name: `king of god ${i}`,
                    desc: "Horror Movies",
                    duration: 90,
                    releaseDate: "2024-07-27T21:51:00.754Z",
                    imageId: "cinema/iwcz87xmqp5xhlu3vttv",
                    imagePath: "https://res.cloudinary.com/dhoygcm5d/image/upload/v1721891259/cinema/iwcz87xmqp5xhlu3vttv.jpg",
                    categoryId: i,
                    director: "Sea",
                    actor: "Sea pro",
                    language: "VN",
                    urlTrailer: "https://www.youtube.com/watch?v=kVCVRbUETSY&t=2583s",
                },
              });
        }
    }

    async createRoom():Promise<void>{
        for( let i = 0 ; i < 20 ; i++ ){
            await this.prisma.room.create({
                data: {
                  roomName: `A${i}`,
                  capacity: 50,
                },
              });
        }
    }


}
