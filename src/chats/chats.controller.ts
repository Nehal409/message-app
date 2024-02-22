import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthenticatedGuard } from 'src/auth/utils/guards/authenticated.guard';

@Controller('/chat')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get(':receiverId')
  async getPrivateChat(
    @Param('receiverId') receiverId: string,
    @Request() req,
  ) {
    const sender = req.user;
    return this.chatService.fetchPrivateMessage(sender.user, receiverId);
  }
}
