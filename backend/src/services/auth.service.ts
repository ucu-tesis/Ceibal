// auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpUserRequest } from 'src/models/requests/sign-up-user.request';
import { LoginUserRequest } from 'src/models/requests/login-user.request';
import { JwtPayload } from 'src/strategies/jwt.strategy';
import { Student, User } from '@prisma/client';
import { Request } from 'express';

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

  createTokenWithPayload(payload: JwtPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  createTeacherToken(user: User): string {
    const payload: JwtPayload = this.createTeacherPayload(user);
    return this.createTokenWithPayload(payload);
  }

  createStudentToken(student: Student): string {
    const payload: JwtPayload = this.createStudentPayload(student);
    return this.createTokenWithPayload(payload);
  }

  createTeacherPayload(user: User): JwtPayload {
    return {
      ci: user.cedula,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      type: 'teacher',
    };
  }

  createStudentPayload(user: Student): JwtPayload {
    return {
      ci: user.cedula,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      type: 'student',
    };
  }
}
