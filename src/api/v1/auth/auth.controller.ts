import { Controller,  Post, Body, Res, HttpStatus,HttpCode, UseGuards } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { ApiTags ,ApiBearerAuth} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { AuthGuard } from './auth.gruad';
import { RolesGuard } from './role.gruad';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}
    //register user
    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() body:registerDto):Promise<{message:string;res:any}>{

      const result = await this.authService.register(body);
      delete result.password
      return { message: 'Create account successfully!', res: result}; 
      
      
    }
    //login
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginDTO): Promise<{ message: string; res: any }> {
      const result = await this.authService.login(body);
      return { message: 'Logged in successfully!', res: result };
    }
}
