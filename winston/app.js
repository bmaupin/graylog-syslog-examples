'use strict';

const { config, createLogger, format, transports } = require('winston');
const Syslog = require('winston-syslog').Syslog;

const { combine, label, printf, timestamp } = format;

const myFormat = printf(({ label, level, message, stack, timestamp }) => {
  return (
    `${timestamp} [${label}] ${level}: ${message}` + (stack ? `\n${stack}` : '')
  );
});

const logger = createLogger({
  level: 'debug',
  // https://github.com/winstonjs/winston-syslog#log-levels
  levels: config.syslog.levels,
  format: combine(
    // label would be a great place to put the application name so it can be used as a search filter in Graylog
    label({ label: 'test-graylog-syslog' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new Syslog({
      // Defaults to localhost
      // host: '127.0.0.1',
      port: 5140,
      // This is the default
      // protocol: 'udp4',
      // TODO: what does this do?
      app_name: 'test_app_name',
      // This is needed so that the proper timestamp format is used; see ../README.md
      type: '5424',
    }),
  ],
});

const main = () => {
  testLoggingWithStackTraces();

  // Hack to work around https://github.com/winstonjs/winston-syslog/issues/155
  setTimeout(() => {
    process.exit();
  }, 500);
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
