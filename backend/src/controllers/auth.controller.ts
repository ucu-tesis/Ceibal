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
  async signUp(@Body() userDto: SignUpUserRequest) {
    if (
      !userDto.ci ||
      !userDto.password ||
      !userDto.email ||
      !userDto.first_name ||
      !userDto.last_name
    ) {
      throw new BadRequestException('All fields are required');
    }
    return await this.authService.signUp(userDto);
  }
}
