import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './AuthService';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Serialize()
  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);

    session.userId = user.id;
    return { user };
  }

  @Serialize()
  @Post('signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);

    session.userId = user.id;
    return { user };
  }

  @Get('signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  @Serialize()
  @UseGuards(AuthGuard)
  @Get('whoami')
  async whoAmI(@CurrentUser() user: User) {
    return { user };
  }

  @Serialize()
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return { user };
  }

  @Serialize()
  @Get()
  async findAllUsers() {
    return { users: await this.usersService.findAll() };
  }
}
