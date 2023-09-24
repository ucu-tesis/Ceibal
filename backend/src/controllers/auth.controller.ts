import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyAuthGuard } from 'src/guards/any-auth.guard';
import { GoogleGuard } from 'src/guards/google.guard';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Controller('auth')
export class AuthController {
  /**
   * Cookie duration in milliseconds.
   */
  cookieDuration = 1000 * 60 * 60 * 24 * 30;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Necessary to redirect to Google OAuth2 login page.
   * It's the start of the Google OAuth2 flow.
   */
  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth() {
    return;
  }

  /**
   * This is the callback URL that Google will redirect to after the user logs in.
   */
  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(@Req() req, @Res() res) {
    const token = this.authService.createTokenWithPayload(req.user);
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: this.cookieDuration,
    });
    res.redirect(this.configService.get('FRONTEND_URL'));
  }

  /**
   * Returns the user's information if they are logged in.
   * Used in the frontend to check if the user is logged in, since the
   * JS frontend doesn't have access to the cookies (httponly).
   */
  @Get('user-init')
  @UseGuards(AnyAuthGuard)
  async userInit() {
    const user = this.userService.get();
    if (user) {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
      };
    }
    throw new Error('User not found');
  }

  /**
   * This is a fake login endpoint that is only available in development and staging.
   * It logs in the as first student in the database.
   */
  @Get('fake-student')
  async fakeStudentLogin(@Res() res) {
    if (
      this.configService.get('ENVIRONMENT') !== 'development' ||
      this.configService.get('ENVIRONMENT') !== 'staging'
    ) {
      return res.status(403).send('Forbidden');
    }
    const student = await this.prisma.student.findFirst();
    const token = this.authService.createStudentToken(student);
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: this.cookieDuration,
    });
  }

  /**
   * This is a fake login endpoint that is only available in development and staging.
   * It logs in the as first teacher in the database.
   */
  @Get('fake-teacher')
  async fakeTeacherLogin(@Res() res) {
    if (
      this.configService.get('ENVIRONMENT') !== 'development' ||
      this.configService.get('ENVIRONMENT') !== 'staging'
    ) {
      return res.status(403).send('Forbidden');
    }
    const teacher = await this.prisma.user.findFirst();
    const token = this.authService.createTeacherToken(teacher);
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: this.cookieDuration,
    });
  }
}
