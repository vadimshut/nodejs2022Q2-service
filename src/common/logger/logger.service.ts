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
}
