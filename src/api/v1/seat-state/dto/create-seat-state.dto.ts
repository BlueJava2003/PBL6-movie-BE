import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSeatStateDto {
  @ApiProperty({
    description: 'Room ID that the seat belongs to',
    default: 1,
  })
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @ApiProperty({
    description: 'Seat ID that the seat belongs to',
    default: 1,
  })
  @IsInt()
  @IsNotEmpty()
  seatId: number;
}
