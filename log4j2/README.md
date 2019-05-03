### Sending log4j2 logs to Graylog via syslog
1. Add a syslog appender in `<Appenders>`:

    ```xml
    <Syslog name="syslog" format="RFC5424" host="127.0.0.1" port="514" protocol="UDP" appName="testlog4j2" mdcId="mdc">
      <LoggerFields>
        <KeyValuePair key="thread" value="%t"/>
        <KeyValuePair key="priority" value="%p"/>
        <KeyValuePair key="category" value="%c"/>
        <KeyValuePair key="exception" value="%ex{full}"/>
      </LoggerFields>
    </Syslog>
    ```

    Change `host`, `port`, and `appName` as needed. See below for more information on these parameters.

1. Reference the syslog in the root appender, e.g.:

    ```xml
    <Loggers>
      <Logger name="org.apache.log4j.xml" level="info"/>
      <Root level="debug">
        <AppenderRef ref="syslog"/>
    ```


### Testing
This directory contains a minimal app that can be used to test sending log4j2 logs to Graylog via syslog. To use it:

1. Modify src/main/resources/log4j2.xml as desired (see above)

1. Run the app

    ```
    ./gradlew build && ./gradlew run
    ```


### Notes on syslog appender parameters
- `appName=`
    - This is optional but highly recommended in order to easily search Graylog for a specific application's logs
- `format="RFC5424"`
    - This formats the timestamp into a way that Graylog can parse it, and also enables the additional fields in
    `LoggerFields`
- `mdcId="mdc"`
    - This is required for the RFC5424 format. An error will be thrown if it's omitted.
- `protocol="UDP"`
    - While this can be set to TCP, oddly enough the results are much better with UDP. In particular, newlines get
    preserved with UDP, whereas with TCP they seem to be split into separate messages similarly to [log4j1's syslog appender](../log4j1/).
- `<LoggerFields>`
    - The default RFC5424 log format only contains minimal information (timestamp, hostname, appname, pid, message).
    Including `<LoggerFields>` can add more information to the log, all of which is recognized by Graylog as separate
    fields.

These can all be safely omitted:
- `enterpriseNumber="18060"`
    - This is the default value
- `facility="LOCAL0"`
    - This is the default value
- `id=`
    - This doesn't appear to be sent
- `includeMDC="true"`
    - This is the default value
- `newLine="true"`
    - Adds a newline at the end of the log, which doesn't have any effect in how the log's displayed in Graylog