import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}

export class UserResponseWrapperDto {
  @Expose()
  user: UserResponseDto;
}
