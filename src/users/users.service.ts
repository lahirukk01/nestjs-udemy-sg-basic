import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOneById(id: number) {
    return this.repo.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  findAll() {
    return this.repo.find();
  }
}
