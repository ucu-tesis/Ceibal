import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TeacherGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (user && user.type === 'teacher') {
      return user;
    }
    throw err || new UnauthorizedException('You are not a teacher');
  }
}
