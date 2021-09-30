'use strict';

const pino = require('pino');
const transport = pino.transport({
  target: 'pino-pretty',
});
const logger = pino(transport);

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
