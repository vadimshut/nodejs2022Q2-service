import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { ALTERNATIVE_PORT } from './constants';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { CustomLogger } from './common/logger/logger.service';
import { HttpExceptionFilter } from './common/HttpExceptionFilter';
import { LEVELS_NAME } from './common/logger/levelsName.enum';
import { writeToFile } from './common/logger/logger.utils';
config();

const PORT = Number(process.env['PORT']) || ALTERNATIVE_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const customLogger = app.get(CustomLogger);
  app.useLogger(customLogger);
  app.useGlobalFilters(new HttpExceptionFilter(customLogger));

  const rootDirname = dirname(__dirname);
  const DOC_API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(DOC_API);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  SwaggerModule.setup('doc', app, document);
  await app.listen(PORT);
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}
bootstrap();

process.on('unhandledRejection', (reason, promise) => {
  writeToFile(
    LEVELS_NAME.ERROR,
    `Unhandled rejection: ${promise}, reason" ${reason}`,
  );
});

process.on('uncaughtException', (err, origin) => {
  writeToFile(
    LEVELS_NAME.ERROR,
    `Unhandled exception: ${err}, exception origin" ${origin}`,
  );
});
