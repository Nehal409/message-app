import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthSignupDto } from './dto/signup-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { encodePassword, comparePassword } from './bcrypt';
import { WsException } from '@nestjs/websockets';

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

  async validateUser(phone: string, password: string) {
    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      return null;
    }

    const areEqual = await comparePassword(password, user.password);

    if (areEqual) {
      return user;
    }

    return null;
  }

  async getUserFromSocketRequest(socket) {
    const userId = socket.user;
    if (!userId) {
      throw new WsException('UserId is missing');
    }

    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
      },
      where: { id: userId.user },
    });

    if (!user) {
      throw new WsException('Invalid credentials');
    }
    return user;
  }
}
