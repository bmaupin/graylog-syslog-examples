package test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {
    static Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        testLoggingWithStackTraces();
    }

    private static void testLoggingWithStackTraces() {
        makeStackTraceLonger();
    }

    private static void makeStackTraceLonger() {
        notLongEnough();
    }

    private static void notLongEnough() {
        okayThatsEnough();
    }

    private static void okayThatsEnough() {
        logErrorWithStackTrace();
        logInfoWithStackTrace();
        logDebugWithStackTrace();
    }

    private static void logErrorWithStackTrace() {
        logger.error("Test error message, without stack trace");
        logger.error("Test error message, with stack trace", new IllegalArgumentException("Test exception message"));
    }

    private static void logInfoWithStackTrace() {
        logger.info("Test info message, without stack trace");
        logger.info("Test info message, with stack trace", new IllegalArgumentException("Test exception message"));
    }

    private static void logDebugWithStackTrace() {
        logger.debug("Test debug message, without stack trace");
        logger.debug("Test debug message, with stack trace", new IllegalArgumentException("Test exception message"));
    }
}
