import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { ArrayNotEmpty, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { State } from '@prisma/client';

export class UpdateBookingDto {
  @ApiProperty({ description: 'Seat positions you want to change to!' })
  @ArrayNotEmpty()
  @IsInt({ each: true })
  seatIds?: number[];
}
