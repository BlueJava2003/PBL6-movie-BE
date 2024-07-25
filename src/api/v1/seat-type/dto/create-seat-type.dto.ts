import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSeatTypeDto {
  @ApiProperty({ description: 'Seat Type Name', default: 'VIP' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;
  @ApiProperty({ description: 'Seat Price', default: 45000 })
  @IsInt()
  @IsNotEmpty()
  price: number;
}
