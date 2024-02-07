import {
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
import { Server } from 'socket.io';
import { WebSocketExceptionFilter } from './filters/ws-exception.filter';
import { WsAuthenticatedGuard } from './guards/ws.guard';

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

  @UseGuards(WsAuthenticatedGuard)
  @UseFilters(WebSocketExceptionFilter)
  @SubscribeMessage('text-chat')
  @UsePipes(ValidationPipe)
  handleMessage(client: any, payload: any): string {
    console.log(payload);
    console.log(client.request.user);
    client.emit('answer', 'Hello client');
    return payload;
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(client.data); //console is showing 'test' as it suppose to
    console.log('user connected');
  }
}
