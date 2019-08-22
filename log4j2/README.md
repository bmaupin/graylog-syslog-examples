### Sending log4j2 logs to Graylog via syslog
1. Add a syslog appender in `<Appenders>`:

    ```xml
    <Syslog name="syslog" format="RFC5424" host="localhost" port="514" protocol="UDP" appName="testlog4j2" mdcId="mdc">
      <LoggerFields>
        <KeyValuePair key="thread" value="%t"/>
        <KeyValuePair key="priority" value="%p"/>
        <KeyValuePair key="category" value="%c"/>
        <KeyValuePair key="exception" value="%ex{full}"/>
      </LoggerFields>
    </Syslog>
    ```

    Change `host`, `port`, and `appName` as needed. See below for more information on these parameters.

1. Reference the syslog appender in the root logger, e.g.:

    ```xml
    <Loggers>
      <Root level="info">
        <AppenderRef ref="syslog"/>
    ```


### Testing
This directory contains a minimal app that can be used to test sending log4j2 logs to Graylog via syslog. To use it:

1. Modify src/main/resources/log4j2.xml as desired (see above)

1. Run the app

    ```
    ./gradlew build && ./gradlew run
    ```


### Notes on syslog appender configuration
- `appName=`
    - Optional but highly recommended. This sets the RFC 5424
    [APP-NAME](https://tools.ietf.org/html/rfc5424#section-6.2.5), which will be set as the `application_name` field in
    Graylog.
- `format="RFC5424"`
    - This formats the logs according to [RFC 5424](https://tools.ietf.org/html/rfc5424), which Graylog is better able
    to parse making searching much easer. In particular, it formats the timestamp
    [in a specific way](https://tools.ietf.org/html/rfc5424#section-6.2.3) and also enables the additional fields in
    `LoggerFields` as RFC 5424 [STRUCTURED-DATA](https://tools.ietf.org/html/rfc5424#section-6.3).
- `mdcId="mdc"`
    - This is required for the RFC5424 format. An error will be thrown if it's omitted.
- `protocol="UDP"`
    - While this can be set to TCP, oddly enough the results are much better with UDP. In particular, newlines get
    preserved with UDP, whereas with TCP they seem to be split into separate messages similarly to
    [log4j1's syslog appender](../log4j1/).
- `<LoggerFields>`
    - The default RFC5424 log format only contains minimal information (timestamp, hostname, appname, pid, message).
    Including `<LoggerFields>` can add more information to the log, all of which is recognized by Graylog as separate
    fields (e.g. `mdc@18060_thread`, `mdc@18060_priority`, etc).

These parameters can all be safely omitted:
- `enterpriseNumber="18060"`
    - This is the default value.
- `facility="LOCAL0"`
    - This is the default value.
- `id=`
    - This doesn't appear to be sent.
- `includeMDC="true"`
    - This is the default value.
- `newLine="true"`
    - Adds a newline at the end of the log, which doesn't have any effect in how the log's displayed in Graylog.
