import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import dotenv from 'dotenv';
dotenv.config();
import AppModules from '@modules';

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModules);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v2');
  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);
  console.log(`App listening on http://localhost:${PORT}`);
}
bootstrap();
