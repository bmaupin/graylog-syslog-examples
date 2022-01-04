#### ⚠ Bunyan is not recommended for sending logs to Graylog via syslog

Bunyan formats its logs as per RFC3164, however the timestamp is incorrect. This actually works well with Graylog, but seems prone to breaking: [https://github.com/joyent/node-bunyan-syslog/issues/61](https://github.com/joyent/node-bunyan-syslog/issues/61)

To use Bunyan anyway:

1. Install bunyan and bunyan-syslog

   ```
   npm install bunyan bunyan-syslog
   ```

1. See the [bunyan-syslog](https://github.com/joyent/node-bunyan-syslog) documentation and the included example in [app.ts](app.ts)

## Testing

This directory contains a minimal app that can be used to test sending logs to Graylog via syslog. To use
it:

1. Install the dependencies

   ```
   npm install
   ```

1. Modify [app.ts](app.ts) as desired (e.g. change the port and hostname)

1. Run the app

   ```
   npm start
   ```
