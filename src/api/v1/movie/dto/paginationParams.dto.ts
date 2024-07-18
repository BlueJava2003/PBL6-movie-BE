import { IsNumber, Min, IsOptional } from 'class-validator';
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
  offset?: number;
 
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({
    description: 'fill to limit movie',
    default: '2',
  })
  @Min(1)
  limit?: number;
}