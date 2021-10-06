## Sending Node.js logs to Graylog via syslog using winston

See [app.ts](app.ts) for a full example.

1. Follow the instructions here to install and configure `winston-syslog`: [https://github.com/winstonjs/winston-syslog#readme](https://github.com/winstonjs/winston-syslog#readme)

1. In the transport options, set `type: '5424',` to use RFC 5424 formatted logs (see [../README.md](../README.md))

1. In the transport options, set `app_name` to the application name

1. (Recommended) remove `timestamp` from format

   Timestamp isn't needed in the format since it will be sent by the syslog transport. See [app.ts](app.ts) for an example of using a custom format per transport.

1. (Recommended) remove `label` from format

   The application name (`app_name`) will be sent by the syslog transport

1. Work around [https://github.com/winstonjs/winston-syslog/issues/139](https://github.com/winstonjs/winston-syslog/issues/139) and [https://github.com/winstonjs/winston-syslog/issues/156](https://github.com/winstonjs/winston-syslog/issues/156)

   1. Install the newer fork of glossy

      ```
      npm install @myndzi/glossy
      ```

   1. Import the fork of glossy

      ```javascript
      const glossy = require('@myndzi/glossy');
      ```

   1. Pass the producer from the fork of glossy into the syslog transport via `customProducer`:

      ```javascript
      const logger = winston.createLogger({
      transports: [
         new winston.transports.Syslog({
            customProducer: glossy.Produce,
            // ...
      ```

#### Sending logs over TCP

The above instructions are for sending logs over UDP; to send them over TCP:

1. Use these settings in the syslog transport:

   ```javascript
   protocol: 'tcp4',
   eol: '\0',
   ```

1. In the Graylog Syslog TCP transport, set `use_null_delimiter: true`

For more information, see the _TCP vs UDP_ section here: [../README.md](../README.md)

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
