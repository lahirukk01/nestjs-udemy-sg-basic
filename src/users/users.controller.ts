import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './AuthService';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User, UserRole } from './user.entity';
import { UserResponseDto } from './dtos/user-response';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @Serialize(UserResponseDto)
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);

    const userClone = structuredClone(user);
    delete userClone.password;
    session.currentUser = userClone;
    return { user };
  }

  @Post('signin')
  @HttpCode(200)
  @Serialize(UserResponseDto)
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    const userClone = structuredClone(user);
    delete userClone.password;
    session.currentUser = userClone;
    return { user };
  }

  @Post('signout')
  @HttpCode(200)
  async signOut(@Session() session: any) {
    session.currentUser = null;
  }

  @Get('whoami')
  @Roles(UserRole.OWNER)
  @Serialize(UserResponseDto)
  async whoAmI(@CurrentUser() user: User) {
    return { user };
  }

  @Get(':id')
  @Serialize(UserResponseDto)
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return { user };
  }

  @Get()
  @Serialize(UserResponseDto)
  async findAllUsers() {
    return { users: await this.usersService.findAll() };
  }
}
