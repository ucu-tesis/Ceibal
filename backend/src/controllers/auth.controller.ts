import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserRequest } from 'src/models/requests/login-user.request';
import { SignUpUserRequest } from 'src/models/requests/sign-up-user.request';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginUserRequest) {
    if (!user.ci || !user.password) {
      throw new BadRequestException('La cédula y contraseña son requeridos');
    }
    if (this.authService.validateUser(user)) {
      return {
        message: 'success',
        token: this.authService.createToken(user),
      };
    } else {
      throw new UnauthorizedException('CI o contraseña incorrectos');
    }
  }

  @Post('sign-up')
  async signUp(@Body() user: SignUpUserRequest) {
    if (
      !user.ci ||
      !user.password ||
      !user.email ||
      !user.first_name ||
      !user.last_name
    ) {
      throw new BadRequestException('All fields are required');
    }
    return await this.authService.signUp(user);
  }
}
