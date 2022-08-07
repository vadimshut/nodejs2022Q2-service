import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LEVELS_NAME } from './levelsName.enum';
import { writeToFile } from './logger.utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  objectToString(obj: any) {
    return JSON.stringify(obj);
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, query, body } = request;

    response.on('finish', () => {
      const { statusCode } = response;
      const message = `${method} ${originalUrl} ${statusCode} Query parameters: ${this.objectToString(
        query,
      )}, Body: ${this.objectToString(body)}`;

      writeToFile(LEVELS_NAME.LOG, message);
      this.logger.log(message);
    });

    next();
  }
}
