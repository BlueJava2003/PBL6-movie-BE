import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './api/mailer/mailer.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './api/v1/auth/auth.module';
import { CategoryMovieModule } from './api/v1/category-movie/category-movie.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule,
    AuthModule,
    MailerModule,
    CategoryMovieModule
  ],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
