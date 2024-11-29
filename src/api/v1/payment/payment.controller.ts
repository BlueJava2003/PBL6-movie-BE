import { Controller, Post, Body, Redirect, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/api/v1/auth/auth.guard';
import { query, Response } from 'express';

@Controller('payment')
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

    // @Get('create')
    // @UseGuards(AuthGuard)
    // createPayment(
    //     @Query('amount') amount: number,
    //     @Query('bookingId') bookingId: string,
    //     @Res() res: Response,
    // ) {
    //     const url = this.paymentService.createPaymentUrl(amount, bookingId);
    //     return res.send(url);
    // }

    // @Get('ipn')
    // async handleIpn(@Query() query: any, @Res() res: Response): Promise<Response> {
    //     const result = await this.paymentService.handleIpn(query);
    //     return res.json(result);
    // }

}
