import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSeatDto } from './create-seat.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSeatDto extends PartialType(CreateSeatDto) {
  @ApiProperty({ description: 'Seat Name', default: 'A1' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'Seat Type ID', default: '1' })
  @IsInt()
  @IsNotEmpty()
  seatTypeId: number;
}
