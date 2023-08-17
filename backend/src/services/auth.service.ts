// auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpUserRequest } from 'src/models/requests/sign-up-user.request';
import { LoginUserRequest } from 'src/models/requests/login-user.request';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(login: LoginUserRequest): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { cedula: login.ci },
    });
    if (user && (await bcrypt.compare(login.password, user.password_hash))) {
      return true;
    }
    return false;
  }

  async signUp(user: SignUpUserRequest): Promise<any> {
    const { ci, email, first_name, last_name, password } = user;
    const password_hash = await bcrypt.hash(password, 10);
    const createdUser = await this.prisma.user.create({
      data: {
        cedula: ci,
        email,
        first_name,
        last_name,
        password_hash,
      },
    });
    createdUser.password_hash = undefined;
    return createdUser;
  }

  createToken(user: LoginUserRequest) {
    const payload = { ci: user.ci };
    return this.jwtService.sign(payload);
  }
}
