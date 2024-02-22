import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { LocalStrategy } from 'src/auth/utils/LocalStrategy';
import { SessionSerializer } from 'src/auth/utils/session.serializer';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { TypeORMSession } from 'src/auth/entities/session.entity';
import { ChatsService } from 'src/chats/chats.service';
import { Chat } from 'src/chats/entities/chat.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, TypeORMSession, Chat]),
    PassportModule.register({ session: true }),
  ],
  providers: [
    ChatGateway,
    AuthService,
    ChatsService,
    LocalStrategy,
    SessionSerializer,
  ],
})
export class WebSocketsModule {}
