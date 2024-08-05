import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MailerService } from 'src/api/mailer/mailer.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_ACCESS_TOKEN },
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy, MailerService],
  controllers: [AuthController],
})
export class AuthModule {}
