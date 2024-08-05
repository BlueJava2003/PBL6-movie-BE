import {
  Controller,
  Post,
  Body,
  Headers,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  HttpException,
  Get,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { refreshTokenDTO } from './dto/refreshToken.dto';
import { changePasswordDTO } from './dto/changePassword.dto';
import { AuthGuard } from './auth.gruad';
import { forgotPasswordDTO } from './dto/forgotPassword.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //register user
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() body: registerDto,
  ): Promise<{ message: string; res: any }> {
    const result = await this.authService.register(body);
    delete result.password;
    return { message: 'Create account successfully!', res: result };
  }
  //login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO): Promise<{ message: string; res: any }> {
    const result = await this.authService.login(body);
    return { message: 'Logged in successfully!', res: result };
  }
  //refresh
  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() body: refreshTokenDTO,
  ): Promise<{ message: string; res: any }> {
    const result = await this.authService.refreshToken(body);
    return { message: 'Refresh token in successfully!', res: result };
  }
  //changePassword
  @UseGuards(AuthGuard)
  @Post('changePassword')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() body: changePasswordDTO,
    @Req() req,
  ): Promise<any> {
    try {
      const authId = req.payload.id;
      const result = await this.authService.changePassword(body, authId);
      return { message: 'Change password in successfully!', res: result };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('checkToken')
  async checkToken(): Promise<any> {
    try {
      return { message: 'Check Token in successfully!', res: '' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //forgotPassword
  @Post('forgotPassword')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() body: forgotPasswordDTO,
    @Req() req,
  ): Promise<any> {
    try {
      const result = await this.authService.forgotPassword(body);
      return { message: 'Please check your email!' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //logout
  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Headers('authorization') auth: string,
    @Req() req,
  ): Promise<any> {
    try {
      const authId = req.payload.id;
      const result = await this.authService.logout(authId, auth);
      return { message: 'logout in successfully!', res: result };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
