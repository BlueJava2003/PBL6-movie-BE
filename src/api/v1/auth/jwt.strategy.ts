    import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  ctx: any;
  constructor(private prisma: PrismaService,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: { id: number; email: string }) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(this.ctx.req);
    const user = await this.prisma.auth.findUnique({
      where: { id: payload.id },
    });

    return { userId: payload.id, email: payload.email, role: user.role };
  }
}