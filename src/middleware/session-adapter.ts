import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { RequestHandler } from 'express';
import * as passport from 'passport';

export class SessionAdapter extends IoAdapter {
  private session: RequestHandler;

  constructor(session: RequestHandler) {
    super();
    this.session = session;
  }

  create(port: number, options?: ServerOptions): Server {
    const server: Server = super.create(port, options);
    const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);
    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));

    return server;
  }
}
