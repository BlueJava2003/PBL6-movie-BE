import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({
    description: 'Seat Name',
    default: 'A1',
    pattern: '^[A-Z]([1-9]|10)$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]([1-9]|10)$/, {
    message: 'Seat name must be a letter (A-Z) followed by a number (1-10)',
  })
  @Transform(({ value }) => value.trim().toUpperCase())
  name: string;

  @ApiProperty({ description: 'Seat Type ID', default: 1 })
  @IsInt()
  @IsNotEmpty()
  seatTypeId: number;
}
