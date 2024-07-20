import { scheduled } from 'rxjs';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  arrayNotEmpty,
} from 'class-validator';

export class CreateRoomStateDto {
  @ApiProperty({ description: 'Schudule ID', default: 1 })
  @IsInt()
  @IsNotEmpty()
  scheduleId: number;

  @ApiProperty({ description: 'Room ID', default: 1 })
  @IsInt()
  @IsNotEmpty()
  roomId: number;
}
