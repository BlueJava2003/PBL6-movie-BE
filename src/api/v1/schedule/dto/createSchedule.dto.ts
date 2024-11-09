import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateScheduleDTO {
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'fill to date ',
    default: '2024-07-17 06:52:26.109',
  })
  date: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'fill to timeStart',
    default: '2024-07-17 06:52:26.109',
  })
  timeStart: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'fill to timeEnd',
    default: '2024-07-17 06:52:26.109',
  })
  timeEnd: Date;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: 'fill to movieId',
    default: '1',
  })
  movieId: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: 'fill to roomId',
    default: '1',
  })
  roomId: number;
}
