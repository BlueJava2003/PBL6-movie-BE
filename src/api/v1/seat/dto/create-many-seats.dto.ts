import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateManySeatsDto {
  @ApiProperty({
    description: 'The number of row you want to create',
    default: 3,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  rows: number;
  @ApiProperty({
    description: 'The number of seat in a row you want to create',
    default: 10,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  seatsPerRow: number;

  @ApiProperty({
    description: 'The seat type ID',
    default: 1,
  })
  @IsInt()
  @IsNotEmpty()
  seatTypeId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]$/, {
    message: 'startChar must be a single uppercase letter from A to Z',
  })
  startChar: string = 'A'; // Default value is 'A'
}
