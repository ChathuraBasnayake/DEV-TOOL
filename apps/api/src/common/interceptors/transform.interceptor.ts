import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ResponseFormat<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        // Skip wrapping if headers were already sent (e.g. file stream downloads)
        if (res.headersSent) {
          return data as ResponseFormat<T>;
        }

        // If the return structure is already wrapped
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'data' in data
        ) {
          return data as unknown as ResponseFormat<T>;
        }

        return {
          success: true,
          data: (data ?? null) as T,
        };
      }),
    );
  }
}
