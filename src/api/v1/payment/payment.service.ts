import { Injectable } from '@nestjs/common';
import { BookingService } from 'src/api/v1/booking/booking.service';
import { IpnFailChecksum } from 'src/api/v1/payment/constant/ipn-result-for-vnpay.constant';
import { IpnSuccess, ProductCode, VNPay, VnpLocale, dateFormat, ignoreLogger } from 'vnpay';

@Injectable()
export class PaymentService {

  private vnpay: VNPay;

  constructor(private bookingService: BookingService) {
    this.vnpay = new VNPay({
      tmnCode: '3YEQFE65',
      secureSecret: 'OVA796S7VWPTLFESIDADARGWPWRUERT4',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      enableLog: true,
      loggerFn: ignoreLogger,
    });
  }

  createPaymentUrl(amount: number, txnRef: string): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const paymentUrl = this.vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: '1.1.1.1',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `order information`,
      // vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: 'https://www.facebook.com/',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });
    return paymentUrl;
  }

  handleIpn(query: any): any {
    const verify = this.vnpay.verifyIpnCall(query);
    if (!verify) {
      return IpnFailChecksum;
    }
    this.bookingService.finalizeBooking(Number(verify.vnp_TxnRef));
    return IpnSuccess;
  }

}