import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/signup-user.dto';
import { AuthSigninDto } from './dto/signin-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signupUser(@Body() signupDto: AuthSignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('/signin')
  signinUser(@Body() signinDto: AuthSigninDto) {
    return this.authService.signin(signinDto);
  }
}
