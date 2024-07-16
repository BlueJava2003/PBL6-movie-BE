import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSeatTypeDto {
  @ApiProperty({ description: 'Seat Name' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'Seat Price' })
  @IsInt()
  @IsNotEmpty()
  price: number;
}
