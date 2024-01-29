import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/signup-user.dto';
import { LocalAuthGuard } from './utils/guards/local-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signupUser(@Body() signupDto: AuthSignupDto) {
    return this.authService.signup(signupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async login(@Request() req) {
    return req.user;
  }

  @Get('/logout')
  async logout(@Request() req) {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
