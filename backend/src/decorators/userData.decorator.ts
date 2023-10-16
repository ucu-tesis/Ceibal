import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtPayload } from 'src/strategies/jwt.strategy';

export const UserData = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user as JwtPayload;
    if (!user) {
      throw new UnauthorizedException('Unable to get user data');
    }
    if (key) {
      return user[key];
    }
    return user;
  },
);
