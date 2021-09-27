Various documentation and test apps for sending logs to Graylog via syslog.

Note that in most situations it would be preferable to send logs to Graylog as [Graylog Extended Log Format (GELF)](https://docs.graylog.org/en/4.1/pages/sending/gelf.html) messages; this repository is only when the logs must be sent through syslog.

- [Grails 2](grails2/)
- [Log4j 1](log4j1/)
- [Log4j 2](log4j2/)
- [Spring Boot](spring-boot/)

## Testing

#### See logs sent by applications

If you want to see the log messages that are being sent, a quick way is to use netcat to listen on a local port and dump the logs to the console; this is also helpful for troubleshooting if, for example, the timestamp in the log is improperly formatted (which may make it difficult to find the log in Graylog):

```
nc -klu 5140
```

Or to insert a newline between every message:

```
while true; do nc -lu 5140 -w0; echo; done
```

Alternatively, see below for setting up a test Graylog server.

#### Setting up a local Graylog server for testing

1. Clone this repo: https://github.com/Graylog2/docker-compose/

1. Create .env file

   ```
   cd open-core
   cp .env.example .env
   ```

1. Set `GRAYLOG_PASSWORD_SECRET` and `GRAYLOG_ROOT_PASSWORD_SHA2` in the .env file according to the instructions in the file

1. Set the time zone for the admin user in docker-compose.yml

   Add this under `graylog` > `environment`:

   ```yaml
   GRAYLOG_ROOT_TIMEZONE: '...'
   ```

   Replace `...` with a valid timezone from http://joda-time.sourceforge.net/timezones.html, e.g. `America/New_York`

1. Remove this line from docker-compose.yml:

   ```yaml
   restart: 'always'
   ```

1. Start the server

   ```
   docker-compose up
   ```

1. Login using a user name of `admin` and whatever value you used when you set `GRAYLOG_ROOT_PASSWORD_SHA2`

1. Add a new syslog input

   1. _System / Inputs_ (click the hamburger menu if you don't see it) > _Inputs_

   1. _Select input_ > _Syslog UDP_ > _Launch new input_

   1. Set the _Port_ to `5140` (this port is already pre-configured in the docker-compose file)

   1. Check _Store full message_ (this will help troubleshooting)

   1. _Save_

1. Send some syslog logs to localhost on port 5140/udp (see one of the provided test apps)

1. Go to _Search_ to see any logs you send to the server

   - You can see the full message under `full_message` as needed
