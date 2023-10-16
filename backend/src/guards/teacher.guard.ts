import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TeacherGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (user && user.type === 'teacher') {
      return user;
    }
    throw err || new Error('You are not a teacher'); // TODO respond with 401 or 403 instead of 500
  }
}
