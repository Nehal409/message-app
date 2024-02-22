import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  async createMessage(createChatDto: CreateChatDto) {
    const newMessage = this.chatRepository.create(createChatDto);
    await this.chatRepository.save(newMessage);
    return newMessage;
  }

  async fetchPrivateMessage(sender: string, receiver: string) {
    const messages = await this.chatRepository.find({
      select: {
        senderId: true,
        receiverId: true,
        messageContent: true,
      },
      // retrieve messages between the two users, regardless of who is the sender or receiver.
      where: [
        {
          senderId: sender,
          receiverId: receiver,
        },
        {
          senderId: receiver,
          receiverId: sender,
        },
      ],
    });
    return messages;
  }
}
