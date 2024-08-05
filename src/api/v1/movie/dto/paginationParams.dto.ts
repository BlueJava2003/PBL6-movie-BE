import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationParamsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({
    description: 'fill to offset movie',
    default: '1',
  })
  @Min(0)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({
    description: 'fill to limit movie',
    default: '10',
  })
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'fill to limit movie',
    default: 'desc',
  })
  orderBy?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'fill to limit movie',
    default: 'today | upcoming',
  })
  option?: string;
}
