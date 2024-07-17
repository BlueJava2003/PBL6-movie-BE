import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateSeatDto {
  @ApiProperty({ description: "Seat Name", default: "A1" })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: "Seat Type ID", default: "1" })
  @IsInt()
  @IsNotEmpty()
  seatTypeId: number;
}
