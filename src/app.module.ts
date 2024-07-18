import { SeatTypeModule } from './api/v1/seat-type/seat-type.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './api/mailer/mailer.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './api/v1/auth/auth.module';
import { CategoryMovieModule } from './api/v1/category-movie/category-movie.module';
import { RoomModule } from './api/v1/room/room.module';
import { SeatModule } from './api/v1/seat/seat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule,
    AuthModule,
    MailerModule,
    SeatTypeModule,
    CategoryMovieModule,
    RoomModule,
    SeatModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
