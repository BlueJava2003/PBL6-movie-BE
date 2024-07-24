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
import { MovieModule } from './api/v1/movie/movie.module';
import { ScheduleModule } from './api/v1/schedule/schedule.module';
import { SeatModule } from './api/v1/seat/seat.module';
import { RoomStateModule } from './api/v1/room-state/room-state.module';
import { BookingModule } from './api/v1/booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule,
    AuthModule,
    CategoryMovieModule,
    RoomModule,
    MovieModule,
    ScheduleModule,
    SeatTypeModule,
    SeatModule,
    RoomStateModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
