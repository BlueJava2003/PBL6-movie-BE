import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerOptions } from './mailer-options.interface';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const options: MailerOptions = {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
    this.transporter = nodemailer.createTransport(options);
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: 'haidx@kdhm-solutions.com',
        to,
        subject,
        text,
        html,
      });
      return info;
    } catch (error) {
      throw error;
    }
  }
}