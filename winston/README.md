## Sending Node.js logs to Graylog via syslog using winston

See [app.js](app.js) for a full example.

1. Follow the instructions here to install and configure `winston-syslog`: [https://github.com/winstonjs/winston-syslog#readme](https://github.com/winstonjs/winston-syslog#readme)

1. In the transport options, set `type: '5424',` to use RFC 5424 formatted logs (see [../README.md](../README.md))

1. In the transport options, set `app_name` to the application name

1. (Recommended) remove `timestamp` from format

   Timestamp isn't needed in the format since it will be sent by the syslog transport. See [app.js](app.js) for an example of using a custom format per transport.

1. (Recommended) remove `label` from format

   The application name (`app_name`) will be sent by the syslog transport

1. Work around [https://github.com/winstonjs/winston-syslog/issues/139](https://github.com/winstonjs/winston-syslog/issues/139)

   ```
   npm install git+https://github.com/pavkriz/glossy
   ```

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
   node start
   ```
