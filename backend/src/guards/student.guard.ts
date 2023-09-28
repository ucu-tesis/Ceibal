import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class StudentGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (user && user.type === 'student') {
      return user;
    }
    throw err || new Error('You are not a student');
  }
}
