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
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  scheduleId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  roomId: number;
}
