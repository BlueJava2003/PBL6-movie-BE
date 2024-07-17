import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createCategoryDTO {
    
    @IsString({ message: 'name must be a string' })
    @ApiProperty({
      description: 'fill to name category',
      default: 'Horror Movies',
    })
    name: string;

    @IsString({ message: 'desc must be a string' })
    @ApiProperty({
      description: 'fill to desc',
      default: 'ghost',
    })
    desc: string;
}