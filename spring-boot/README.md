## Sending Spring Boot logs to Graylog via syslog

#### Sending Spring Boot logs using log4j2 (recommended)

Spring Boot uses logback by default, which unfortunately has a very limited syslog appender. As such, it is recommended
to use log4j2:

1. Update your Maven or Gradle configuration to include the `spring-boot-starter-log4j2` dependency and exclude the
`spring-boot-starter-logging` dependency:

    [Configure Log4j for Logging](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-logging.html#howto-configure-log4j-for-logging)

2. Add a log4j2 configuration to src/main/resources/log4j2.xml

    See [log4j2](../log4j2/).


#### Sending Spring Boot logs using logback

1. Add a logback configuration to src/main/resources/logback.xml, e.g.:

    ```xml
    <configuration>
      <appender name="SYSLOG" class="ch.qos.logback.classic.net.SyslogAppender">
        <syslogHost>localhost</syslogHost>
        <port>514</port>
        <facility>USER</facility>
        <suffixPattern>%-4relative [%thread] %-5level - %msg</suffixPattern>
      </appender>

      <root level="debug">
        <appender-ref ref="SYSLOG" />
      </root>
    </configuration>
    ```



## Testing
This directory contains a minimal app that can be used to test sending Spring Boot logs to Graylog via syslog. To use
it:

1. Modify src/main/resources/log4j2.xml as desired (see [log4j2](../log4j2/))

1. Run the app

    ```
    ./gradlew bootRun
    ```
