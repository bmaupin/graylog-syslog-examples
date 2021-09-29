#### ⚠ Pino is not yet recommended for sending logs to Graylog via syslog

The current stable version of Pino ([v6](https://github.com/pinojs/pino/tree/v6.x)) works by transforming logs using shell piping. I'm not sure how well this would work, for example, to log to stdout AND syslog at the same time. It also seems like it would add complexity when using Pino with containers.

[Pino v7](https://github.com/pinojs/pino) provides a way to transform logs without needing to rely on shell piping, but it is still under development.

1. Install Pino

   Follow the steps here: [https://github.com/pinojs/pino#readme](https://github.com/pinojs/pino#readme)

1. Install pino-syslog

   TODO: Update command once the following PR is merged: [https://github.com/pinojs/pino-syslog/pull/13](https://github.com/pinojs/pino-syslog/pull/13)

   ```
   npm install git+https://github.com/Eomm/pino-syslog/tree/pino-7
   ```

1. TODO: Continue documentation once this issue is resolved: [https://github.com/pinojs/pino/issues/1142](https://github.com/pinojs/pino/issues/1142)
