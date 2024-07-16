import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class changePasswordDTO {
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(50, { message: 'Password must not exceed 50 characters' })
    @IsString({ message: 'Password must be a string' })
    @ApiProperty({
      description: 'your password',
      default: '********',
    })
    oldPassword: string;
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(50, { message: 'Password must not exceed 50 characters' })
    @IsString({ message: 'Password must be a string' })
    @ApiProperty({
      description: 'your password',
      default: '********',
    })
    newPassword: string;
}