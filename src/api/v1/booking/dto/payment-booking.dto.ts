import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PaymentBookingDto {
  @ApiProperty({})
  @IsInt()
  @IsNotEmpty()
  bookingId: number;
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  paymentToken: string;
}
