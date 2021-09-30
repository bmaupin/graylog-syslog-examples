'use strict';

import { config, createLogger, format, transports } from 'winston';
const Syslog = require('winston-syslog').Syslog;
const glossy = require('@myndzi/glossy');

const { combine, label, printf, timestamp } = format;

const consoleFormat = printf(({ label, level, message, stack, timestamp }) => {
  return (
    `${timestamp} [${label}] ${level}: ${message}` + (stack ? `\n${stack}` : '')
  );
});

// Syslog already includes the timestamp and application name (label) so we can leave those out
const syslogFormat = printf(({ level, message, stack }) => {
  return `${level}: ${message}` + (stack ? `\n${stack}` : '');
});

const logger = createLogger({
  level: 'debug',
  // https://github.com/winstonjs/winston-syslog#log-levels
  levels: config.syslog.levels,
  // This allows the custom format for each transport to contain the stack trace (https://github.com/winstonjs/winston/issues/1338#issuecomment-697958085)
  format: format.errors({ stack: true }),
  transports: [
    new transports.Console({
      format: combine(
        label({ label: 'graylog-syslog-winston' }),
        timestamp(),
        consoleFormat
      ),
    }),
    new Syslog({
      // Defaults to localhost
      // host: '127.0.0.1',
      port: 5140,
      // This is the default
      // protocol: 'udp4',
      // This gets set to the `application_name` field in Graylog
      app_name: 'graylog-syslog-winston',
      // This is needed so that the proper timestamp format is used; see ../README.md
      type: '5424',
      format: syslogFormat,
      customProducer: glossy.Produce,
    }),
  ],
});

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

const okayThatsEnough = () => {
  logErrorWithStackTrace();
  logInfoWithStackTrace();
  logDebugWithStackTrace();
};

const notLongEnough = () => {
  okayThatsEnough();
};

const makeStackTraceLonger = () => {
  notLongEnough();
};

const testLoggingWithStackTraces = () => {
  makeStackTraceLonger();
};

const main = () => {
  testLoggingWithStackTraces();

  // Hack to work around https://github.com/winstonjs/winston-syslog/issues/155
  setTimeout(() => {
    process.exit();
  }, 500);
};

main();
