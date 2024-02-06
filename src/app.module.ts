import { Module } from '@nestjs/common';
import { ChatsModule } from './chats/chats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AuthModule } from './auth/auth.module';
import { WebSocketsModule } from './websockets/websockets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ChatsModule,
    AuthModule,
    WebSocketsModule,
  ],
})
export class AppModule {}
