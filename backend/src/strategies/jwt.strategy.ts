import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/services/auth.service';

export type JwtPayload = {
  id: number;
  type: 'teacher' | 'student';
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
    private authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (payload.type === 'teacher') {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });
      if (user) {
        return this.authService.createTeacherPayload(user);
      }
    }
    if (payload.type === 'student') {
      const student = await this.prisma.student.findUnique({
        where: { id: payload.id },
      });
      if (student) {
        return this.authService.createStudentPayload(student);
      }
    }
    throw new UnauthorizedException('Please log in to continue');
  }
}
