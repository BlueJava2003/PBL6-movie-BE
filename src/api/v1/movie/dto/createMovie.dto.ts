import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsNumber, IsString } from "class-validator"

export class createMovieDTO{
    @ApiProperty({
        description: 'fill to name movie',
        default: 'Horror Movies',
    })
    @IsString()
    name:string

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        description: 'fill to duration movie',
        default: '20',
      })
    duration:number

    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        description: 'fill to releaseDate movie',
        default: '2024-07-17 04:51:00.754',
      })
    releaseDate:Date

    @ApiProperty({
        description: 'fill to name movie',
        default: 'Horror Movies',
      })
    @IsString()
     
    desc:string

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        description: 'fill to categoryId movie',
        default: '1',
      })
    categoryId : number

    @ApiProperty({
        description: 'fill to director movie',
        default: 'Sea',
      })
    @IsString()
    director: string

    @ApiProperty({
        description: 'fill to actor movie',
        default: 'Sea pro',
      })
    @IsString()
    actor: string

    @ApiProperty({
        description: 'fill to language movie',
        default: 'VN',
      })
    @IsString()  
    language:string

    @ApiProperty({
        description: 'fill to urlTRailer movie',
        default: 'http://Horror Movies',
      })
    @IsString()
    urlTrailer:string
}