## Sending Grails 2 logs to Graylog via syslog

**⚠ The contents of this directory are unmaintained; Grails 2 reached end of life on 2021-06-30. See [../log4j1/](../log4j1/) for more information on using Log4j 1.**

Grails 2 uses Log4j 1 by default. For more notes on the syslog appender configuration, see [../log4j1/README.md](../log4j1/README.md)

1. Add a syslog appender:

   ```groovy
   appenders {
       appender new org.apache.log4j.net.SyslogAppender(
           name: 'syslog',
           syslogHost: 'localhost:514',
           layout: new org.apache.log4j.EnhancedPatternLayout(conversionPattern: "1 %d{yyyy-MM-dd'T'HH:mm:ss.SSSZ} ${InetAddress.getLocalHost().getHostName()} ${grails.util.Metadata.current.getApplicationName()} [%t] %-5p %c %x - %m%n%throwable")
       )
   }
   ```

   Change the host and port as needed.

   **Note:** If you have `force_rdns: true` set in your Graylog input, you can replace
   `${InetAddress.getLocalHost().getHostName()}` with `-` as Graylog should automatically be able to detect your log
   source.

1. Reference the syslog appender in the root logger, e.g.:

   ```groovy
   root {
       info 'stdout', 'syslog'
   }
   ```

## Testing

This directory contains a minimal script that can be used to test sending Grails 2 logs to Graylog via syslog. To use it:

1. Modify [grails-app/conf/Config.groovy](grails-app/conf/Config.groovy) as desired (see above)

1. Run the script

   ```
   ./grailsw run-script scripts/SendTestLogs.groovy
   ```

   (Ignore errors as these are intentionally generated for test purposes)
