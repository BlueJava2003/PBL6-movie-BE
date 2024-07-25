import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Max,
  Min,
  max,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room Name', default: '01' })
  @IsString()
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;
  @IsNotEmpty()
  roomName: string;
  @ApiProperty({ description: 'Capacity', default: 50 })
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  capacity: number;
}
