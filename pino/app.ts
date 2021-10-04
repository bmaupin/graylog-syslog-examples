'use strict';

const pino = require('pino');
const logger = pino({
  transport: {
    pipeline: [
      {
        target: 'pino-pretty',
      },
      {
        target: 'pino-syslog',
        options: {
          appname: 'graylog-syslog-pino',
        },
      },
      {
        target: 'pino-socket',
        options: {
          // Default is 127.0.0.1
          // address: '127.0.0.1',
          port: 5141,
          mode: 'udp',
        },
      },
    ],
  },
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
};

main();
