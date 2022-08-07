import { ConsoleLogger, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { LOGGER_LEVELS } from './loggerLevels';
config();

@Injectable()
export class CustomLogger extends ConsoleLogger {
  constructor() {
    super();
    this.setLogLevels(LOGGER_LEVELS[process.env.LOGGER_LEVEL]);
  }

  log(message: any, context: string) {
    super.log(message, context);
  }

  error(message: any, stack: string) {
    super.error(message, stack);
  }

  warn(message: any, context: string) {
    super.warn(message, context);
  }

  debug(message: any, contex: string) {
    super.debug(message, contex);
  }

  verbose(message: any, context: string) {
    super.verbose(message, context);
  }
}
