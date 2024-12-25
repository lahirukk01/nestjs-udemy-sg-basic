import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './AuthService';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

const getMillisecondsSinceMidnight = (): number => {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return now.getTime() - midnight.getTime();
};

describe('AuthService', () => {
  let service: AuthService;
  const users: User[] = [];
  let mockUsersService: Partial<UsersService>;

  beforeAll(async () => {
    mockUsersService = {
      findOneByEmail: (email: string) =>
        Promise.resolve(users.find((user) => user.email === email)),
      create: (email: string, password: string) => {
        const user = new User();
        user.id = getMillisecondsSinceMidnight();
        user.email = email;
        user.password = password;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Signup user', async () => {
    const user = await service.signUp('testu1@email.com', 'password1');
    expect(user).toBeDefined();
    expect(user.email).toBe('testu1@email.com');
  });

  it('Signup failed - email in use', async () => {
    await expect(
      service.signUp('testu1@email.com', 'password2'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Signin failed - invalid credentials - user not found', async () => {
    await expect(
      service.signIn('testu2@email.com', 'password2'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Signin failed - invalid credentials - password mismatch', async () => {
    await expect(
      service.signIn('testu1@email.com', 'password2'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Signin user success', async () => {
    const user = await service.signIn('testu1@email.com', 'password1');
    expect(user).toBeDefined();
    expect(user.email).toBe('testu1@email.com');
  });
});
