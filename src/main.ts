import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { ALTERNATIVE_PORT } from './constants';
config();

const PORT = Number(process.env['PORT']) || ALTERNATIVE_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(4000);
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}
bootstrap();
