import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum Model {
    CATEGORY_MOVIE = 'category_movie',
    MOVIE = 'movie',
    SCHEDULE = 'schedule',
    ROOM = 'room',
    SEAT = 'seat',
    SEAT_TYPE = 'seatType'
}

export class ModelDto {
    @IsEnum(Model)
    @ApiProperty({
        enum: ['category_movie','movie','schedule','room','seat','seatType'],
    })
    model: Model;
}