import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGuard } from 'src/guards/google.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(@Req() req) {
    console.log('controller', req.user);
    return {
      message: 'success',
      token: this.authService.createTokenWithPayload(req.user),
    };
  }

  @Get('refresh')
  async refresh(@Req() req, @Res() res) {
    const token = this.authService.createTokenWithPayload(req.user);
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.redirect(this.configService.get('FRONTEND_URL'));
  }
}
