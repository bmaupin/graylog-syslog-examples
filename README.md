### Build and run
```
./gradlew build
./gradlew run
```

### To try
- [x] Customize the stack trace renderer (https://stackoverflow.com/a/38486720/399105)
    - This seems to work, but it still sends the log as two parts: 1. the error, 2. the stack trace
- [ ] SocketAppender
    - Logs will need to be formatted expliclity for syslog
    - This should allow us to send using TCP as well
