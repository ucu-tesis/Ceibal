import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/strategies/jwt.strategy';

export const UserData = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user as JwtPayload;
    if (key) {
      return user[key];
    }
    return user;
  },
);
