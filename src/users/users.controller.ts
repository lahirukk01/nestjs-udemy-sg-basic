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
import { UserResponseDto } from './dtos/user-response';

@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Serialize(UserResponseDto)
  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);

    session.userId = user.id;
    return { user };
  }

  @Serialize(UserResponseDto)
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

  @Serialize(UserResponseDto)
  @UseGuards(AuthGuard)
  @Get('whoami')
  async whoAmI(@CurrentUser() user: User) {
    return { user };
  }

  @Serialize(UserResponseDto)
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return { user };
  }

  @Serialize(UserResponseDto)
  @Get()
  async findAllUsers() {
    return { users: await this.usersService.findAll() };
  }
}
