### Sending log4j1 logs to Graylog via syslog
1. Add a syslog appender:

    ```xml
    <appender name="syslog2" class="org.apache.log4j.net.SyslogAppender">
      <param name="SyslogHost" value="localhost:514"/>
      <layout class="org.apache.log4j.EnhancedPatternLayout">
        <param name="ConversionPattern" value="%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ} testlog4j1 [%t] %-5p %c %x - %m%n%throwable"/>
      </layout>
    </appender>
    ```

    Change the host and port as needed. Also change `testlog4j1` to your application name to make it easier to search
    for your application's logs in Graylog.

1. Reference the syslog appender in the root logger, e.g.:

    ```xml
    <root>
      <priority value="info" />
      <appender-ref ref="syslog" />
    ```


### Testing
This directory contains a minimal app that can be used to test sending log4j1 logs to Graylog via syslog. To use it:

1. Modify src/main/resources/log4j.xml as desired (see above)

1. Run the app

    ```
    ./gradlew build && ./gradlew run
    ```


### Notes on syslog appender configuration
- `<layout class="org.apache.log4j.EnhancedPatternLayout">`
    - This layout is necessary in order to use `%throwable` (see below)
- `%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ}`
    - This date pattern can be parsed by Graylog without any additional configuration, including parsing the milliseconds
    correctly.
- `%throwable`
    - If a log includes a stack trace, by default the syslog appender will send each line of the stack trace as a
    separate syslog message and will appear as separate log entries in Graylog. This causes the entire stack trace to be
    sent as one message (up to the 1024-byte limit of syslog, after which point the message will be split).

These parameters can all be safely omitted:
- `<param name="Facility" value="USER"/>`
    - This can be omitted unless you specifically want to override the facility.
- `<param name="FacilityPrinting" value="true"/>`
    - This should be omitted (`FacilityPrinting` is false by default) because it will add the string value of the
    facility to the beginning of the message, which will prevent Graylog from correctly parsing the timestamp of the
    message.
- `<param name="Header" value="true"/>`
    - This should be omitted because it causes a less accurate timestamp to be set in the header (it doesn't include
    year or milliseconds), which overrides the timestamp in the log.
