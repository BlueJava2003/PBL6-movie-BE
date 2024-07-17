import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room Name', default: '01' })
  @IsString()
  @IsNotEmpty()
  roomName: string;
  @ApiProperty({ description: 'Capacity', default: '50' })
  @IsString()
  @IsNotEmpty()
  capacity: string;
}
