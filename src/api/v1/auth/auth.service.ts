import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { registerDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { refreshTokenDTO } from './dto/refreshToken.dto';
import { changePasswordDTO } from './dto/changePassword.dto';
import { forgotPasswordDTO } from './dto/forgotPassword.dto';
import { MailerService } from 'src/api/mailer/mailer.service';
@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async generateToken(payload: {
    id: number;
    email: string;
    role: string;
  }) {
    const [accessToken, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
        secret: process.env.JWT_SECRET_KEY,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.EXPIRES_REFRESH_TOKEN,
        secret: process.env.JWT_SECRET_KEY,
      }),
    ]);
    return { accessToken, refresh_token };
  }

  private async generateRandomPassword(length: number = 10): Promise<string> {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async register(registerDto: registerDto): Promise<Auth> {
    try {
      const exited = await this.prisma.auth.findUnique({
        where: {
          email: registerDto.email,
        },
      });
      if (exited)
        throw new HttpException(
          'Email already exits. Please use another email',
          HttpStatus.CONFLICT,
        );

      const hashPassword = await this.hashPassword(registerDto.password);
      const createAccount = await this.prisma.auth.create({
        data: {
          ...registerDto,
          password: hashPassword,
        },
      });
      createAccount.password = undefined;
      return createAccount;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async login(
    loginDto: LoginDTO,
  ): Promise<{ accessToken: string; refresh_token: string }> {
    try {
      const { email, password } = loginDto;
      const user = await this.prisma.auth.findUnique({
        where: { email },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HttpException(
          'Email or password is not correct',
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload = { id: user.id, email: user.email, role: user.role };
      const token = await this.generateToken(payload);
      await this.prisma.auth.update({
        where: {
          email: user.email,
        },
        data: {
          refreshToken: token.refresh_token,
          accessToken: token.accessToken,
        },
      });
      return token;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async refreshToken(
    refreshTokenDto: refreshTokenDTO,
  ): Promise<{ accessToken: string; refresh_token: string }> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: process.env.JWT_SECRET_KEY,
        },
      );
      const user = await this.prisma.auth.findUnique({
        where: { id: decodedToken.id },
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }
      const payload = { id: user.id, email: user.email, role: user.role };
      const gtoken = await this.generateToken(payload);

      await this.prisma.auth.update({
        where: {
          id: decodedToken.id,
        },
        data: {
          refreshToken: gtoken.refresh_token,
        },
      });
      return gtoken;
    } catch (error) {
      throw new HttpException('Error authentication', HttpStatus.UNAUTHORIZED);
    }
  }

  async changePassword(data: changePasswordDTO, id: number): Promise<void> {
    try {
      const auth = await this.prisma.auth.findUnique({
        where: {
          id: id,
        },
      });
      const checkPassword = await bcrypt.compare(
        data.oldPassword,
        auth.password,
      );
      if (!checkPassword)
        throw new HttpException(
          'old password incorrect',
          HttpStatus.BAD_REQUEST,
        );
      const hashPassword = await this.hashPassword(data.newPassword);
      await this.prisma.auth.update({
        where: {
          id: id,
        },
        data: {
          password: hashPassword,
        },
      });
    } catch (error) {
      throw new HttpException('Change password fail', HttpStatus.BAD_REQUEST);
    }
  }

  //forgot password
  async forgotPassword(data: forgotPasswordDTO): Promise<void> {
    try {
      const checkEmail = await this.prisma.auth.findUnique({
        where: {
          email: data.email,
        },
      });
      if (!checkEmail)
        throw new HttpException('Email not exited', HttpStatus.BAD_REQUEST);
      const passwordRandom = await this.generateRandomPassword();
      const hashPassword = await this.hashPassword(passwordRandom);
      await this.prisma.auth.update({
        where: {
          id: checkEmail.id,
        },
        data: {
          password: hashPassword,
        },
      });
      await this.mailerService.sendMail(
        checkEmail.email,
        'Forgot password',
        'Welcome to cinema',
        `<h1>please do not disclose your new password: ${passwordRandom}</h1>`,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async logout(userId: number, accessToken: string): Promise<void> {
    try {
      await this.prisma.auth.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      await this.prisma.backList.create({
        data: { oldAccessToken: accessToken },
      });
      await this.prisma.auth.update({
        where: {
          id: userId,
        },
        data: {
          accessToken: null,
          refreshToken: null,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getInfoUser(userId: number): Promise<string> {
    const user = await this.prisma.auth.findUnique({
      where: { id: userId },
    });
    return user.fullname;
  }

}
