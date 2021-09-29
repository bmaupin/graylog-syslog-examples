const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'graylog-syslog-bunyan' });

const logErrorWithStackTrace = () => {
  logger.error('Test error message, without stack trace');
  // logger.error(new Error('Test exception message'));
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
  // logInfoWithStackTrace();
  // logDebugWithStackTrace();
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
