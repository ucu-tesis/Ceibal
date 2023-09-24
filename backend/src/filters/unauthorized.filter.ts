import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Check if the request is JSON
    if (request.headers['content-type'] === 'application/json' || request.xhr) {
      response.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
      });
    } else {
      response.redirect(
        this.configService.get('FRONTEND_URL') + '/login?error=true',
      );
    }
  }
}
