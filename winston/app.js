'use strict';

const { createLogger, format, transports } = require('winston');

const { combine, label, printf, timestamp } = format;

const myFormat = printf(({ label, level, message, stack, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message} ${stack}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    // label would be a great place to put the application name so it can be used as a search filter in Graylog
    label({ label: 'test-graylog-syslog' }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()],
});

const main = () => {
  testLoggingWithStackTraces();
};

const testLoggingWithStackTraces = () => {
  makeStackTraceLonger();
};

const makeStackTraceLonger = () => {
  notLongEnough();
};

const notLongEnough = () => {
  okayThatsEnough();
};

const okayThatsEnough = () => {
  logErrorWithStackTrace();
  logInfoWithStackTrace();
  logDebugWithStackTrace();
};

const logErrorWithStackTrace = () => {
  logger.error('Test error message, without stack trace');
  logger.error(new Error('Test exception message'));
};

const logInfoWithStackTrace = () => {
  logger.info('Test info message, without stack trace');
  logger.info(new Error('Test exception message'));
};

const logDebugWithStackTrace = () => {
  logger.debug('Test debug message, without stack trace');
  logger.debug(new Error('Test exception message'));
};

main();
