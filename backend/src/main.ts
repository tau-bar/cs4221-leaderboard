import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = process.env.CORS_ORIGIN
    ? { origin: process.env.CORS_ORIGIN.split(','), credentials: true }
    : { origin: true, credentials: true };

  app.enableCors(corsOptions);
  app.use(json({ limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();
