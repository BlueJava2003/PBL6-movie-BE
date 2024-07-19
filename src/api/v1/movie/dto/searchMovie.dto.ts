import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class SearchMovieDTO{
    @IsString()
    @ApiProperty({
        description: 'fill to name movie',
        default: 'ma',
      })
    name:string
}