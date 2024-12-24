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
    return next.handle().pipe(
      map((data: object) => {
        if ('user' in data) {
          const user = plainToClass(this.dto, data.user, {
            excludeExtraneousValues: true,
          });

          return { user };
        } else if ('users' in data && Array.isArray(data.users)) {
          return {
            users: data.users.map((user: User) =>
              plainToClass(this.dto, user, { excludeExtraneousValues: true }),
            ),
          };
        }
      }),
    );
  }
}
