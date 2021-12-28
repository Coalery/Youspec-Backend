import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const code = exception.getStatus();

    response.status(code).json({
      code,
      data: exception.getResponse(),
      timestamp: new Date().toISOString(),
    });
  }
}
