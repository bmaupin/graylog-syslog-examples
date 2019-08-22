## Sending log4j1 logs to Graylog via syslog
1. Add a syslog appender:

    ```xml
    <appender name="syslog2" class="org.apache.log4j.net.SyslogAppender">
      <param name="SyslogHost" value="localhost:514"/>
      <layout class="org.apache.log4j.EnhancedPatternLayout">
        <param name="ConversionPattern" value="1 %d{yyyy-MM-dd'T'HH:mm:ss.SSSZ} hostname testlog4j1 [%t] %-5p %c %x - %m%n%throwable"/>
      </layout>
    </appender>
    ```

    In the `SyslogHost` parameter change the host and port as needed. Then in the `ConversionPattern` parameter change
    `hostname` to the FQDN of the server (this will be populated as the `source` field in Graylog) and change
    `testlog4j1` to your application name (this will be populated as the `application_name` field in Graylog).

1. Reference the syslog appender in the root logger, e.g.:

    ```xml
    <root>
      <priority value="info" />
      <appender-ref ref="syslog" />
    ```


## Testing
This directory contains a minimal app that can be used to test sending log4j1 logs to Graylog via syslog. To use it:

1. Modify src/main/resources/log4j.xml as desired (see above)

1. Run the app

    ```
    ./gradlew build && ./gradlew run
    ```


## Notes on syslog appender configuration
- `<layout class="org.apache.log4j.EnhancedPatternLayout">`
    - This layout is necessary in order to use `%throwable` (see below)
- `ConversionPattern` values

    By default, log4j1 implements a simple BSD/[RFC 3164](https://tools.ietf.org/html/rfc3164) style syslog format. By
    modifying the format to comply with [RFC 5424](https://tools.ietf.org/html/rfc5424), Graylog is better able to parse
    the logs which makes searching much easier.
    - `1`
        - This sets the RFC 5424 [VERSION](https://tools.ietf.org/html/rfc5424#section-6.2.2) of the syslog message,
        which is necessary for Graylog to recognize the message format as RFC 5424.
    - `%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ}`
        - This sets the RFC 5424 [TIMESTAMP](https://tools.ietf.org/html/rfc5424#section-6.2.3) which can be parsed by
        Graylog without any additional configuration, including parsing the milliseconds correctly.
    - `hostname`
        - This sets the RFC 5424 [HOSTNAME](https://tools.ietf.org/html/rfc5424#section-6.2.4) which will be set as the
        `source` field in Graylog.
    - `testlog4j1`
        - This sets the RFC 5424 [APP-NAME](https://tools.ietf.org/html/rfc5424#section-6.2.5), which will be set as the
        `application_name` field in Graylog.
    - `%throwable`
        - If a log includes a stack trace, by default the syslog appender will send each line of the stack trace as a
        separate syslog message and will appear as separate log entries in Graylog. This causes the entire stack trace
        to be sent as one message (up to the 1024-byte limit of syslog, after which point the message will be split).

These parameters can all be safely omitted:
- `<param name="Facility" value="USER"/>`
    - This can be omitted unless you specifically want to override the facility.
- `<param name="FacilityPrinting" value="true"/>`
    - This should be omitted (`FacilityPrinting` is false by default) because it will add the string value of the
    facility to the beginning of the message, which will prevent Graylog from correctly parsing the timestamp of the
    message.
- `<param name="Header" value="true"/>`
    - This will include an [RFC 5424 header](https://tools.ietf.org/html/rfc5424#section-6.2) with the timestamp and
    hostname, but this should be omitted because the timestamp in the header is less accurate (it doesn't include year
    or milliseconds) and overrides the timestamp in the log.
