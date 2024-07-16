import { IsString,IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateCategoryDTO {
    
    @IsString({ message: 'name must be a string' })
    @IsOptional()
    @ApiProperty({
        description: 'fill to name category',
        default: 'Horror Movies',
    })
    name: string;

    @IsString({ message: 'desc must be a string' })
    @IsOptional()
    @ApiProperty({
        description: 'fill to desc',
        default: 'ghost Hoang',
    })
    desc: string;
}