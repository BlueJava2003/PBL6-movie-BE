import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateManySeatStatesDto {
  @ApiProperty({
    description: 'Room ID that the seat belongs to',
    default: 1,
  })
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @ApiProperty({
    description: 'An array include Seat IDs',
    default: [1, 2, 3, 4],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  seatIds: number[];
}
