import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (request.headers['content-type'] === 'application/json' || request.xhr) {
      response.status(403).json({
        statusCode: 403,
        message: 'Forbidden',
      });
    } else {
      response.redirect(
        this.configService.get('FRONTEND_URL') + '/login?googleError=true',
      );
    }
  }
}
