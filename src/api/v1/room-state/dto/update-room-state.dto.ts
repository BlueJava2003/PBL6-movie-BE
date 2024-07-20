import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoomStateDto } from './create-room-state.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  arrayNotEmpty,
} from 'class-validator';

export class UpdateRoomStateDto {
  @ApiProperty({
    description: 'List of seat Id you want to switch to unavailable seat',
    default: [1, 2, 3],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  seatIds: number[];
}
