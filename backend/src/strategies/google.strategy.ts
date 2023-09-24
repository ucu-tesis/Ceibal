import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma.service';
import { JwtPayload } from './jwt.strategy';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    googleProfile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, name, emails, photos } = googleProfile;

    const user = await this.prismaService.user.findFirst({
      where: {
        email: emails[0].value,
      },
    });
    if (user) {
      const result: JwtPayload = this.authService.createTeacherPayload(user);
      return done(null, result);
    }

    const student = await this.prismaService.student.findFirst({
      where: {
        email: emails[0].value,
      },
    });
    if (student) {
      const result: JwtPayload = this.authService.createStudentPayload(student);
      return done(null, result);
    }

    throw new UnauthorizedException();
  }
}
