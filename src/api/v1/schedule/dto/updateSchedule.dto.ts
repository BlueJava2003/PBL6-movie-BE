import { IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateScheduleDTO {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    description: 'fill to date ',
    default: '2024-07-17 06:52:26.109',
  })
  date: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    description: 'fill to timeStart',
    default: '2024-07-17 06:52:26.109',
  })
  timeStart: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    description: 'fill to timeEnd',
    default: '2024-07-17 06:52:26.109',
  })
  timeEnd: Date;
}
