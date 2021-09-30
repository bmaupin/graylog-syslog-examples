Various documentation and example apps for sending logs to Graylog via syslog.

Note that in most situations it would be preferable to send logs to Graylog as [Graylog Extended Log Format (GELF)](https://docs.graylog.org/en/4.1/pages/sending/gelf.html) messages; this repository is only for when the logs must be sent as syslog messsages.

- JDK
  - [Grails 2](grails2/)
  - [Log4j 1](log4j1/)
  - [Log4j 2](log4j2/)
  - [Spring Boot](spring-boot/)
- Node.js
  - [Bunyan](bunyan/)
  - [Pino](pino/)
  - [Winston](winston/)

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

## Graylog and syslog

#### BSD (RFC 3164) vs RFC 5424

Some syslog clients may give the option of sending logs formatted as BSD ([RFC 3164](https://datatracker.ietf.org/doc/html/rfc3164)) or [RFC 5424](https://datatracker.ietf.org/doc/html/rfc5424) messages. Always prefer RFC 5424 when possible, because it has the following advantages:

- More accurate timestamps, including milliseconds and timezone
- More fields, including application name, process ID, message ID, structured data (custom fields)

The biggest painpoint when sending BSD-formatted messages to Graylog is the timestamp:

- Because there's no time zone, Graylog will always assume logs are sent with a UTC time zone
- Because there are no milliseconds, logs will likely be out of order

Here is an example of a BSD-formatted syslog message (generated using [log4j2](./log4j2) without `format`):

```
<131>Sep 27 11:33:14 localhost Test error message, without stack trace
```

Here is an example of the same message formatted according to RFC 5424 (generated using [log4j2](./log4j2) with `format="RFC5424"`):

```
<131>1 2021-09-27T11:33:14.564-04:00 localhost testlog4j2 56903 - [mdc@18060 category="App" exception="" priority="ERROR" thread="main"] Test error message, without stack trace
```

#### How Graylog parses syslog messages

Given the sample RFC 5424 above, here is how Graylog will parse it:

- The first part (in angle brackets) is the syslog [facility](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2), which gets set to these fields in Graylog: `facility`, `facility_num`, and `level`
- After that should be a `1`, which tells Graylog that the message adheres to [syslog protocol version 1 (RFC 5424)](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.2)
- The next field is the [timestamp](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.3), which Graylog parses providing that it's properly formatted
- Next field is the [hostname](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.4), set to the `source` field in Graylog
- Next field is the [application name](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.5), set to the `application_name` field in Graylog
- Next field is the [process ID](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.6), set to the `process_id` field in Graylog
- Next field is the [message ID](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.6), which above is empty (`-` is an empty value in syslog; see [NILVALUE](https://datatracker.ietf.org/doc/html/rfc5424#section-6))
- If [structured data](https://datatracker.ietf.org/doc/html/rfc5424#section-6.3) is present, each item will each get parsed as fields in Graylog
- Everything else gets set to the `message` field in Graylog
