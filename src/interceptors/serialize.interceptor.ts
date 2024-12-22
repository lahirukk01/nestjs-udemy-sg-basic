import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserResponseDto } from '../users/dtos/user-response';
import { User } from '../users/user.entity';
import { plainToClass } from 'class-transformer';

interface IClassConstructor {
  new (...args: any[]): object;
}

export const Serialize = () =>
  UseInterceptors(new SerializeInterceptor(UserResponseDto));

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: IClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<object> {
    return next
      .handle()
      .pipe(
        map((data: User) =>
          plainToClass(this.dto, data, { excludeExtraneousValues: true }),
        ),
      );
  }
}
