import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { ArrayNotEmpty, IsEnum, IsInt } from 'class-validator';
import { State } from '@prisma/client';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  seatIds?: number[];
  @ApiProperty()
  @IsEnum(['PENDING', 'SUCCESS'])
  state: State;
}
