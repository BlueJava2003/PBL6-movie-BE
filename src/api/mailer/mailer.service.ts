import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerOptions } from './mailer-options.interface';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const options: MailerOptions = {
      service: 'gmail',
      port: 465,
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
  createHtml(context: any): string {
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice Payment</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  background-color: #ffffff;
                  padding: 20px;
                  margin: 0 auto;
                  max-width: 600px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
              }
              .header img {
                  max-width: 100px;
              }
              .content {
                  margin: 20px 0;
                  display:flex;
                  flex-direction:column;
                  justify-content:center;
                  align-items:center;
                  flex-wrap:no-wrap;

              }
              .content h1 {
                  font-size: 24px;
                  margin: 0 0 20px 0;
              }
              .content p {
                  font-size: 16px;
                  margin: 0 0 10px 0;
              }
              .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .invoice-table th, .invoice-table td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: left;
              }
              .invoice-table th {
                  font-weight: normal;
                  color: #666666;
              }
              .invoice-table td {
                  font-weight: bold;
                  color: #000000;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 14px;
                  color: #888;
              }
              .qr-code {
                  background-color:white;
                  width:300px;
                  height:300px;
                  margin: 0 auto;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${context.movieName}t</h1>
              </div>
              <div class="content">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/736px-QR_Code_Example.svg.png?20111025115625" class="qr-code" alt="QR Image">

                  <table class="invoice-table">
                      <tr>
                          <th>Phòng chiếu</th>
                          <td>${context.hall}</td>
                      </tr>
                      <tr>
                          <th>Ghế</th>
                          <td>${context.seats}</td>
                      </tr>
                      <tr>
                          <th>Thời gian thanh toán</th>
                          <td>${context.paymentTime}</td>
                      </tr>
                      <tr>
                          <th>Suất chiếu</th>
                          <td>${context.showTime}</td>
                      </tr>
                      <tr>
                          <th>Tổng tiền</th>
                          <td>${context.totalAmount} VND</td>
                      </tr>
                  </table>
              </div>
              <div class="footer">
                  <p>Thank you!</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
}
