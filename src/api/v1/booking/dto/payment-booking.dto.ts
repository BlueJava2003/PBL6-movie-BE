import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PaymentBookingDto {
  @ApiProperty({ description: 'Booking ID', default: 1 })
  @IsInt()
  @IsNotEmpty()
  bookingId: number;
  @ApiProperty({
    description:
      'Payment token (just for mock function, type anything you want)',
  })
  @IsString()
  @IsNotEmpty()
  paymentToken: string;
}
