import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class StudentGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (user && user.type === 'student') {
      return user;
    }
    throw err || new UnauthorizedException('You are not a student');
  }
}
