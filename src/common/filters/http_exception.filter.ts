import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message ?? exception.message
        : 'Internal Server Error';

    res.status(status).json({
      status: status >= 400 ? 'error' : 'success',
      responseCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      data: null,
    });
  }
}
