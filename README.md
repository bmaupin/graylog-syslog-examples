### The problem
When using log4j v1 to send logs to Graylog via syslog, if a log includes a stack trace, each line of the log and the stack trace will be sent and appear as separate log entries in Graylog:

```
<11>2019-05-01T11:31:11.971-0400 testlog4j1 [main] ERROR App  - Test error message, with stack trace\n
<11>java.lang.IllegalArgumentException: Test exception message
<11>    at App.logErrorWithStackTrace(App.java:30)
<11>    at App.okayThatsEnough(App.java:23)
<11>    at App.notLongEnough(App.java:19)
<11>    at App.makeStackTraceLonger(App.java:15)
<11>    at App.testLoggingWithStackTraces(App.java:11)
<11>    at App.main(App.java:7)
```


### The solution
Use `EnhancedPatternLayout` with `%throwable`:

```
<appender name="syslog" class="org.apache.log4j.net.SyslogAppender">
  <param name="SyslogHost" value="localhost:8514"/>
  <layout class="org.apache.log4j.EnhancedPatternLayout">
    <param name="ConversionPattern" value="%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ} testlog4j1 [%t] %-5p %c %x - %m%n%throwable"/>
  </layout>
</appender>
```


### Build and run
```
./gradlew build
./gradlew run
```
