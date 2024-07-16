import { IsString, IsEmail, MinLength, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({
    description: 'your email',
    default: 'daohai271@gmail.com',
  })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @IsString({ message: 'Password must be a string' })
  @ApiProperty({
    description: 'your password',
    default: '********',
  })
  password: string;
}