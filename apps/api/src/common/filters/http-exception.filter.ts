import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Format error message to be a string or array of strings
    const msgObj = message as Record<string, unknown>;
    const errorMessage =
      typeof message === 'object' && message !== null
        ? typeof msgObj['message'] === 'string'
          ? msgObj['message']
          : JSON.stringify(message)
        : String(message);

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
      errors:
        typeof message === 'object' && message !== null
          ? (msgObj['errors'] as unknown[] | undefined)
          : undefined,
    };

    response.status(status).json(errorResponse);
  }
}
