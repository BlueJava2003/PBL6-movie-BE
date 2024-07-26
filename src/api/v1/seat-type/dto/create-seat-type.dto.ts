import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSeatTypeDto {
  @ApiProperty({ description: 'Seat Type Name', default: 'VIP' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toUpperCase())
  @Matches(/^[A-Z0-9\s]+$/, {
    message: 'Seat Type Name can only contain letters, numbers, and spaces',
  })
  name: string;
  @ApiProperty({ description: 'Seat Price', default: 45000 })
  @IsInt()
  @IsNotEmpty()
  price: number;
}
