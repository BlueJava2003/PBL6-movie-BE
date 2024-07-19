import { IsString, IsEmail, MinLength, IsNotEmpty, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.enum';

export class registerDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'your email',
        default: 'daohai271@gmail.com',
      })
    email:string;

    @MinLength(6)
    @MaxLength(50)
    @ApiProperty({
      description: 'your email',
      default: '********',
    })
    password:string;
    
    @IsString()
    @ApiProperty({
      default: 'dao hai',
    })
    fullname:string;

    @IsEnum(Role)
    @IsOptional()
    @ApiProperty({enum:['USER','ADMIN']})
    role:Role;
}
