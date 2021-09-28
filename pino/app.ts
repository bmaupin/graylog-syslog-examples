'use strict';

const logger = require('pino')();

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

const main = () => {
  testLoggingWithStackTraces();
};

main();
