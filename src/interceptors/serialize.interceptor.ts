import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

interface IClassConstructor {
  new (...args: any[]): object;
}

export const Serialize = (dto: IClassConstructor) =>
  UseInterceptors(new SerializeInterceptor(dto));

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: IClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<object> {
    return next.handle().pipe(
      map((data: object) => {
        const response = {};

        for (const key in data) {
          if (!data.hasOwnProperty(key)) {
            continue;
          }

          const value = data[key];

          if (typeof data[key] === 'object' && data[key] !== null) {
            // Value is an object
            if (Array.isArray(value)) {
              // Value is an array
              response[key] = value.map((item) =>
                plainToClass(this.dto, item, {
                  excludeExtraneousValues: true,
                }),
              );
            } else {
              // Value is an object
              response[key] = plainToClass(this.dto, value, {
                excludeExtraneousValues: true,
              });
            }
          } else {
            response[key] = value;
          }
        }

        return response;
      }),
    );
  }
}
