import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './api/mailer/mailer.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './api/v1/auth/auth.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
