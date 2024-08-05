import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class createMovieDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'fill to name movie',
    default: 'Horror Movies',
  })
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: 'fill to duration movie',
    default: '20',
  })
  duration: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({
    description: 'fill to releaseDate movie',
    default: '2024-07-17 04:51:00.754',
  })
  releaseDate: Date;

  @ApiProperty({
    description: 'fill to name movie',
    default: 'Horror Movies',
  })
  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: 'fill to categoryId movie',
    default: '1',
  })
  categoryId: number;

  @ApiProperty({
    description: 'fill to director movie',
    default: 'Sea',
  })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({
    description: 'fill to actor movie',
    default: 'Sea pro',
  })
  @IsNotEmpty()
  @IsString()
  actor: string;

  @ApiProperty({
    description: 'fill to language movie',
    default: 'VN',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({
    description: 'fill to urlTRailer movie',
    default: 'http://Horror Movies',
  })
  @IsNotEmpty()
  @IsString()
  urlTrailer: string;

  @ApiProperty({
    description: 'fill to urlTRailer movie',
    default: 'http://Horror Movies',
    format: 'binary',
    type: 'string',
  })
  @IsNotEmpty()
  @IsOptional()
  file: string;
}
