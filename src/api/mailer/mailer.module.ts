import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [MailerService,PrismaService],
  exports: [MailerService],
})
export class MailerModule {}
