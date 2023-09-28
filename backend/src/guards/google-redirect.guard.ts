import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

/**
 * Modified Google guard that redirects the user back to the frontend if authentication fails.
 * Used for the /auth/google/callback route.
 */
@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super();
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();

    if (err || !user) {
      return request.res.redirect(
        this.configService.get('FRONTEND_URL') + '/login?error=google',
      );
    }
    return user;
  }
}
