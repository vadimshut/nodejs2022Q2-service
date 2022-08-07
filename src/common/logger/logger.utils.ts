import { config } from 'dotenv';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import { LEVELS_NAME } from './levelsName.enum';
import { CustomLogger } from './logger.service';

config();

const updateTimestamp = (logLevel: LEVELS_NAME) => {
  logLevel === LEVELS_NAME.ERROR
    ? (CustomLogger.tslastLogError = Date.now())
    : (CustomLogger.tslastLogOtherLogs = Date.now());
};

const createNewLog = (
  logLevel: LEVELS_NAME,
  message = '',
  context = '',
  stack = '',
): string => {
  return logLevel === LEVELS_NAME.ERROR
    ? `[${logLevel}][${message}] - ${stack}\n`
    : `[${logLevel}][${context}] - ${message}\n`;
};

const createFileName = (isErrorLogType: boolean) => {
  return isErrorLogType
    ? `/logs-${LEVELS_NAME.ERROR}-${CustomLogger.tslastLogError}.txt`
    : `/logs-${CustomLogger.tslastLogOtherLogs}.txt`;
};

const getFilePath = (logLevel: LEVELS_NAME) => {
  const isErrorLogType = logLevel === LEVELS_NAME.ERROR;

  const dirname = join(
    __dirname,
    `../../../logs/${isErrorLogType ? 'errors' : 'otherLogs'}`,
  );

  if (!existsSync(dirname)) mkdirSync(dirname);
  const fileName = createFileName(isErrorLogType);
  const filePath = join(dirname, fileName);

  return filePath;
};

export const writeToFile = (
  logLevel: LEVELS_NAME,
  message = '',
  context = '',
  stack = '',
) => {
  const newLog = createNewLog(logLevel, message, context, stack);
  let filePath = getFilePath(logLevel);

  try {
    const { size } = statSync(filePath);

    if (size > +process.env.LOG_FILE_SIZE * 1000) {
      updateTimestamp(logLevel);
      filePath = getFilePath(logLevel);
    }

    writeFileSync(filePath, newLog, { flag: 'as' });
  } catch {
    writeFileSync(filePath, newLog, { flag: 'as' });
  }
};
