import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtPayload } from 'src/strategies/jwt.strategy';
import { Request } from 'express';

// WARNING: trying to pass this in tests as a provider causes all services to be undefined
@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get(): JwtPayload {
    return this.request['user'] as JwtPayload;
  }
}
