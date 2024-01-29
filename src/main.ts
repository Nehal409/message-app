import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT);
}
bootstrap();
