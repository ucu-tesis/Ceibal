import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtPayload } from 'src/strategies/jwt.strategy';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get(): JwtPayload {
    return this.request['user'] as JwtPayload;
  }
}
