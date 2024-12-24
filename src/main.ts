import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieSession from 'cookie-session';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    cookieSession({
      name: 'nest-app-session',
      keys: [configService.get<string>('COOKIE_KEY') ?? 'default_cookie_key'], // Use a secure key in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
