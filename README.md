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


### Build and run
```
./gradlew build
./gradlew run
```


### To try
- [x] Customize the stack trace renderer (https://stackoverflow.com/a/38486720/399105)
    - This seems to work, but it still sends the log as two parts: 1. the error, 2. the stack trace

        ```
        <11>2019-05-01T11:31:45.553-0400 testlog4j1 [main] ERROR App  - Test error message, with stack trace\n
        <11>java.lang.IllegalArgumentException: Test exception message\n\tat App.logErrorWithStackTrace(App.java:30)\n\tat App.okayThatsEnough(App.java:23)\n\tat App.notLongEnough(App.java:19)\n\tat App.makeStackTraceLonger(App.java:15)\n\tat App.testLoggingWithStackTraces(App.java:11)\n\tat App.main(App.java:7)
        ```
- [ ] SocketAppender
    - Logs will need to be formatted expliclity for syslog
    - This should allow us to send using TCP as well
