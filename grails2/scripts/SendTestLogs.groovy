import org.apache.log4j.Logger

Logger log = Logger.getLogger(getClass())

log.info("Test info message, without stack trace")
log.info("Test info message, with stack trace", new IllegalArgumentException("Test exception message"))

log.warn("Test warn message, without stack trace")
log.warn("Test warn message, with stack trace", new IllegalArgumentException("Test exception message"))

log.error("Test error message, without stack trace")
log.error("Test error message, with stack trace", new IllegalArgumentException("Test exception message"))
