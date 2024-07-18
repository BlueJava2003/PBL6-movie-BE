import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room Name', default: '01' })
  @IsString()
  @IsNotEmpty()
  roomName: string;
  @ApiProperty({ description: 'Capacity', default: '50' })
  @IsNumberString()
  @IsNotEmpty()
  capacity: string;
}
