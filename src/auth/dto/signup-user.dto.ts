import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class AuthSignupDto {
  @IsNotEmpty()
  @IsPhoneNumber('PK')
  phone: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
