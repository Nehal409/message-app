import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketExceptionFilter } from './filters/ws-exception.filter';
import { WsAuthenticatedGuard } from './guards/ws.guard';
import { AuthService } from 'src/auth/auth.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatsService } from 'src/chats/chats.service';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';
import { User } from 'src/auth/entities/user.entity';

const { WS_PORT, ORIGIN } = process.env;
const port = Number(WS_PORT);

@WebSocketGateway(port, {
  cors: {
    origin: ORIGIN,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private connectedUsers: { [userId: string]: Socket } = {};
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatsService,
  ) {}

  @UseGuards(WsAuthenticatedGuard)
  @UseFilters(WebSocketExceptionFilter)
  @SubscribeMessage('text-chat')
  @UsePipes(ValidationPipe)
  async handleMessage(
    @MessageBody() payload: ChatMessageDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const sender = await this.authService.getUserFromSocketRequest(
        socket.request,
      );
      // Find the socket of the recipient and emit the message to them
      const receiverSocket = this.findSocketByUserId(payload.receiverId);
      if (!receiverSocket) {
        this.handleError(socket, 'Receiver not found');
        return;
      }
      const chatDto: CreateChatDto = {
        messageContent: payload.message,
        senderId: sender.id,
        receiverId: payload.receiverId,
      };

      await this.chatService.createMessage(chatDto);
      this.emitMessage(receiverSocket, sender, payload.message);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  async handleConnection(socket: Socket) {
    try {
      const user = await this.authService.getUserFromSocketRequest(
        socket.request,
      );
      console.log(`User ${user.username} connected`);

      // Add the connected user to the list
      this.connectedUsers[user.id] = socket;
    } catch (error) {
      console.error(`Error connecting user: ${error.message}`);
      socket.disconnect(true); // Disconnect the socket if user is not authenticated
    }
  }

  // Why is it necessary to remove a user from the list of connected users? This is important because once a user has initially connected to the system, other users have the ability to send messages to them. Even if the user logs out or their cookie expires, it's crucial not to disconnect them from the system so that other users can continue sending messages to them.
  // Will have to change this in future
  async handleDisconnect(socket: Socket) {
    try {
      // @ts-ignore
      const user = socket.request.user.user;
      // When user is failed at handleConnection due to invalid credentials it is also redirected to this function thats why try catch is used here
      if (user) {
        // Remove the disconnected user from the list
        delete this.connectedUsers[user];
      }
    } catch (error) {
      console.error(`Error disconnecting user: ${error.message}`);
    }
  }

  findSocketByUserId(userId: string): Socket | null {
    const socket = this.connectedUsers[userId];
    return socket || null;
  }

  handleError(socket: Socket, errorMessage: string): void {
    socket.emit('error_message', { error: errorMessage });
    console.error(errorMessage);
  }

  emitMessage(receiverSocket: Socket, sender: User, message: string): void {
    receiverSocket.emit('receive_message', { sender, message });
  }
}
