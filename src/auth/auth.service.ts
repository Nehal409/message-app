import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthSignupDto } from './dto/signup-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { encodePassword, comparePassword } from './bcrypt';
import { AuthSigninDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async signup(signupDto: AuthSignupDto) {
    const phone = signupDto.phone;
    const existingUser = await this.userRepository.findOne({
      where: { phone },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const password = encodePassword(signupDto.password);
    const newUser = this.userRepository.create({ ...signupDto, password });
    await this.userRepository.save(newUser);

    return newUser;
  }

  async signin({ phone, password }: AuthSigninDto) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new HttpException('Invalid phone', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await comparePassword(password, user.password);

    if (!areEqual) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return { message: 'success' };
  }

  async validateUser(phone: string, password: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new HttpException('Invalid phone', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await comparePassword(password, user.password);

    if (!areEqual) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return { message: 'success' };
  }
}
