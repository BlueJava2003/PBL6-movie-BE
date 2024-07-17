import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSeatTypeDto {
  @ApiProperty({ description: 'Seat Type Name', default: 'A1' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'Seat Price', default: 45000 })
  @IsInt()
  @IsNotEmpty()
  price: number;
}
