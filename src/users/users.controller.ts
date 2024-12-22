import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize()
  @Post('signup')
  async createUser(@Body() body: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(body.email);

    if (existingUser) {
      throw new BadRequestException('email in use');
    }

    const user = await this.usersService.create(body.email, body.password);

    return user;
  }

  @Serialize()
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
