import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { registerDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService ,
        private readonly jwtService :JwtService
    ){}
    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return bcrypt.hash(password, salt);
      }
    private async generateToken(payload: { id: number; email: string }) {
        const accessToken = await this.jwtService.signAsync(payload,{expiresIn:'1m'});
        const refresh_token = await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '7d'
        });
        
        return { accessToken, refresh_token };
      }
    async register(registerDto: registerDto):Promise<Auth>{
        try {
            const exited = await this.prisma.auth.findUnique({
                where:{
                    email:registerDto.email
                }
            });
            if(exited)
                throw new HttpException('Email exited. Please use another email',HttpStatus.CONFLICT);
           
            
            const hashPassword = await this.hashPassword(registerDto.password);
            const createAccount = await this.prisma.auth.create({
                data:{
                    ...registerDto,
                    password:hashPassword}
                })
            createAccount.password = undefined;
            return createAccount;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
    }
    async login(loginDto: LoginDTO) : Promise<{ accessToken: string; refresh_token: string }>{
        try {
            const { email, password } = loginDto;
            const user = await this.prisma.auth.findUnique({
              where: { email }
            });
            if (!user || !(await bcrypt.compare(password, user.password))) {
              throw new HttpException('Email or password is not correct', HttpStatus.BAD_REQUEST);
            }
            const payload = { id: user.id, email: user.email, role: user.role };
            const token = await this.generateToken(payload);
            await this.prisma.auth.update({
                where:{
                    email:user.email
                },
                data:{
                    refreshToken: token.refresh_token
                }
            });
            return token;
          } catch (error) {
            
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
          }
        }
}

