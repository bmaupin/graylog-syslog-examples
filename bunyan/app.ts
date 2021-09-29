const bunyan = require('bunyan');
const bsyslog = require('bunyan-syslog');

const logger = bunyan.createLogger({
  name: 'graylog-syslog-bunyan',
  level: 'debug',
  streams: [
    {
      stream: process.stdout,
    },
    {
      type: 'raw',
      stream: bsyslog.createBunyanStream({
        host: '127.0.0.1',
        port: 5140,
      }),
    },
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

  // Hack to work around https://github.com/joyent/node-bunyan-syslog/issues/60
  setTimeout(() => {
    process.exit();
  }, 500);
};

main();
