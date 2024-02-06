import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { TypeORMSession } from './auth/entities/session.entity';
import { AppModule } from './app.module';
import { SessionAdapter } from './middleware/session-adapter';
import { DataSource } from 'typeorm';

dotenv.config();
const { SESSION_SECRET, PORT, ORIGIN } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const dataSource = app.get(DataSource);
  const sessionRepo = dataSource.getRepository(TypeORMSession);
  // Duplicate session error here. Two queries are running simultaneously to insert session in the database. Will have to debug that issue
  const sessionMiddleware = session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 1000 * 60 * 24 * 14,
    },
    store: new TypeormStore().connect(sessionRepo),
  });

  app.enableCors({
    origin: ORIGIN,
    credentials: true,
  });
  app.use(helmet());
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.useWebSocketAdapter(new SessionAdapter(sessionMiddleware));

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(PORT);
}
bootstrap();
