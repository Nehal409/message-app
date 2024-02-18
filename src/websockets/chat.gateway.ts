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
  constructor(private readonly authService: AuthService) {}

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
      if (receiverSocket) {
        receiverSocket.emit('receive_message', {
          sender,
          message: payload.message,
        });
      }
    } catch (error) {
      console.error(`Error connecting user: ${error.message}`);
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

  async handleDisconnect(socket: Socket) {
    try {
      // @ts-ignore
      const user = socket.request.user.user;

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
}
