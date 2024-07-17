import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from "class-validator";

export class CreateManySeatsDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  rows: number;
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  seatsPerRow: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  seatTypeId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]$/, {
    message: "startChar must be a single uppercase letter from A to Z",
  })
  startChar: string = "A"; // Default value is 'A'
}
