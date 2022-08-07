import { ConsoleLogger, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { LEVELS_NAME } from './levelsName.enum';
import { writeToFile } from './logger.utils';
import { LOGGER_LEVELS } from './loggerLevels';

config();

@Injectable()
export class CustomLogger extends ConsoleLogger {
  constructor() {
    super();
    this.setLogLevels(LOGGER_LEVELS[process.env.LOGGER_LEVEL]);
  }

  static tslastLogError = Date.now();
  static tslastLogOtherLogs = Date.now();
  static lastLog = Date.now();

  log(message: any, context: string) {
    writeToFile(LEVELS_NAME.LOG, message, context);
    super.log(message, context);
  }

  error(message: any, stack: string) {
    writeToFile(LEVELS_NAME.ERROR, message, '', stack);
    super.error(message, stack);
  }

  warn(message: any, context: string) {
    writeToFile(LEVELS_NAME.WARN, message, context);
    super.warn(message, context);
  }

  debug(message: any, context: string) {
    writeToFile(LEVELS_NAME.DEBUG, message, context);
    super.debug(message, context);
  }

  verbose(message: any, context: string) {
    writeToFile(LEVELS_NAME.VERBOSE, message, context);
    super.verbose(message, context);
  }
}
