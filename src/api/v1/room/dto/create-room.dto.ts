import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  Max,
  Min,
  max,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room Name', default: '01' })
  @IsString()
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsNotEmpty()
  @Matches(/^[\p{L}\p{N}\s]+$/u, {
    message: 'Room name can only contain letters, numbers, and spaces',
  })
  roomName: string;
  @ApiProperty({ description: 'Capacity', default: 50 })
  @IsNotEmpty()
  @Min(1)
  @Max(50)
  capacity: number;
}
