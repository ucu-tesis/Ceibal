import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TeacherGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (user && user.type === 'teacher') {
      return user;
    }
    throw err || new Error('You are not a teacher');
  }
}
