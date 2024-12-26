import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request, Response, NextFunction } from 'express';
import { User } from '../users/user.entity';

declare module 'express' {
  interface Request {
    session?: {
      userId?: number;
    };

    currentUser?: Omit<User, 'password'>; // Add the currentUser property
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOneById(userId);
      delete user.password;
      req.currentUser = user;
    }
    next();
  }
}
