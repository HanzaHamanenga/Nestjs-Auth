import { Controller, Get, UseGuards, Request, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'generated/prisma';


@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user:User) {
    return user; 
  }
  @Patch()
  editUser(){}
}
