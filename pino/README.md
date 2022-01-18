## Sending Node.js logs to Graylog via syslog using pino

⚠ This is subject to change as [Pino v7](https://github.com/pinojs/pino) is still under development

1. Install Pino

   [https://github.com/pinojs/pino#readme](https://github.com/pinojs/pino#readme)

   ```
   npm install pino@next
   ```

1. Install pino-socket and pino-syslog

   ```
   npm install pino-socket pino-syslog
   ```

1. To send logs to syslog, use a [transport pipeline](https://getpino.io/#/docs/transports?id=creating-a-transport-pipeline); this will first format the logs using pino-syslog and then send them to the syslog server using pino-socket, e.g.

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
             port: 5140,
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
             port: 5140,
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
   npm start
   ```
