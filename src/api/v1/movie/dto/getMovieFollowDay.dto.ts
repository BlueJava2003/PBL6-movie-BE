import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber } from "class-validator";

export class GetMovieFollowDay{
    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        description: 'fill to releaseDate movie',
        default: '2024-07-17 04:51:00.754',
      })
    date:Date
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        description: 'fill to id movie',
        default: '1',
      })
    MovieId:number
}