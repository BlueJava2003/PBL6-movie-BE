import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './api/v1/auth/auth.gruad';
import { RolesGuard } from './api/v1/auth/role.gruad';
import { Roles } from './api/decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
