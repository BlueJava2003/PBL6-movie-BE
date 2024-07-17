import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator"

export class updateMovieDTO{
    @ApiProperty({
        description: 'fill to name movie',
        default: 'Horror Movies',
    })
    @IsOptional()
    @IsString()
    name:string

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    @ApiProperty({
        description: 'fill to duration movie',
        default: '20',
      })
    duration:number

    @IsOptional()
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
    @IsOptional()
    desc:string

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
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
    @IsOptional()
    director: string

    @ApiProperty({
        description: 'fill to actor movie',
        default: 'Sea pro',
      })
    @IsString()
    @IsOptional()
    actor: string

    @ApiProperty({
        description: 'fill to language movie',
        default: 'VN',
      })
    @IsString()
    @IsOptional()
    language:string

    @ApiProperty({
        description: 'fill to urlTRailer movie',
        default: 'http://Horror Movies',
      })
    @IsString()
    @IsOptional()
    urlTrailer:string
}