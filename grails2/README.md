## Sending Grails 2 logs to Graylog via syslog
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

1. Reference the syslog appender in the root logger, e.g.:

    ```groovy
    root {
        info 'stdout', 'syslog'
    }
    ```


## Testing
This directory contains a minimal script that can be used to test sending Grails 2 logs to Graylog via syslog. To use it:

1. Modify grails-app/conf/Config.groovy as desired (see above)

1. Run the script

    ```
    ./grailsw run-script scripts/SendTestLogs.groovy
    ```

    (Ignore errors as these are intentionally generated for test purposes)


## Notes on syslog appender configuration
See [../log4j1/README.md](../log4j1/README.md)
