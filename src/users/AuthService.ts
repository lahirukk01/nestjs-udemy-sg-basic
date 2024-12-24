import { BadRequestException, Injectable, Session } from '@nestjs/common';

import { UsersService } from './users.service';
import { hashPasswordWithSalt } from 'src/utils/auth';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const existingUser = await this.usersService.findOneByEmail(email);

    if (existingUser) {
      throw new BadRequestException('email in use');
    }

    const { passwordToStore } = await hashPasswordWithSalt(password);

    const user = await this.usersService.create(email, passwordToStore);

    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    const [salt, hashedPassword] = user.password.split('.');

    const { hashedPassword: hashedEnteredPassword } =
      await hashPasswordWithSalt(password, salt);

    if (hashedPassword !== hashedEnteredPassword) {
      throw new BadRequestException('invalid credentials');
    }

    return user;
  }
}
