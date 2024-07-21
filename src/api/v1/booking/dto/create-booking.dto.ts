import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsInt, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Schedule ID you want to book' })
  @IsInt()
  @IsNotEmpty()
  scheduleId: number;

  @ApiProperty({ description: 'List of seat Ids you want to book' })
  @ArrayNotEmpty()
  @IsInt({ each: true })
  seatIds: number[];
}
