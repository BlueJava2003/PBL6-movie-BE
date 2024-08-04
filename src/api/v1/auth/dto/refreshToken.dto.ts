import { IsString, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class refreshTokenDTO {
  @IsString({ message: 'refresh_token must be a string' })
  @ApiProperty({
    description: 'your refresh_token',
    default: '********',
  })
  refreshToken: string;
}
