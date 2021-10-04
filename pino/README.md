#### ⚠ Pino is not yet recommended for sending logs to Graylog via syslog

The current stable version of Pino ([v6](https://github.com/pinojs/pino/tree/v6.x)) works by transforming logs using shell piping. I'm not sure how well this would work, for example, to log to stdout AND syslog at the same time. It also seems like it would add complexity when using Pino with containers.

[Pino v7](https://github.com/pinojs/pino) provides a way to transform logs without needing to rely on shell piping, but it is still under development.

1. Install Pino

   [https://github.com/pinojs/pino#readme](https://github.com/pinojs/pino#readme)

   ```
   npm install pino@next
   ```

1. Install pino-socket and pino-syslog

   TODO: Update this once the following PR is merged: [https://github.com/pinojs/pino-syslog/pull/13](https://github.com/pinojs/pino-syslog/pull/13)

   ```
   npm install pino-socket git+https://github.com/Eomm/pino-syslog/tree/pino-7
   ```

1. To send logs to syslog, use a feature of Pino called pipeline; this will first format the logs using pino-syslog and then send them to the syslog server using pino-socket, e.g.

   ```javascript
   const logger = pino({
     transport: {
       pipeline: [
         {
           target: 'pino-syslog',
           options: {
             // Set this to the name of your application
             appname: 'graylog-syslog-pino',
           },
         },
         {
           target: 'pino-socket',
           options: {
             // The default is 127.0.0.1
             address: '127.0.0.1',
             port: 5141,
             mode: 'udp',
           },
         },
       ],
     },
   });
   ```

   You can also send logs to stdout and syslog; the example below requires pino-pretty (`npm install pino-pretty`):

   ```javascript
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
             address: '127.0.0.1',
             port: 5141,
             mode: 'udp',
           },
         },
       ],
     },
   });
   ```

## Testing

This directory contains a minimal app that can be used to test sending logs to Graylog via syslog. To use
it:

1. Install the dependencies

   ```
   npm install
   ```

1. Modify [app.ts](app.ts) as desired (e.g. change the port, hostname, etc.)

1. Run the app

   ```
   node start
   ```
