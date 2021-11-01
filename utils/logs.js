const debug = require("debug")("bug-tracker:logs");
const winston = require("winston");
const path = require("path");
const fs = require("fs");

const errorFile = path.join(__dirname, "../logs/error.log");
const logFile = path.join(__dirname, "../logs/combined.log");

/* Delete log files and recreate them, ignore errors */
try { 
  fs.unlinkSync(errorFile); 
  fs.unlinkSync(logFile);
  debug("Log files recreated, logs are active!")
}
catch (ex) { }

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: errorFile, level: "error" }),
    new winston.transports.File({ filename: logFile }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.prettyPrint(),
    })
  );
}

exports.addToLog = (type, message, errors) => {
  logger.log(
    type, 
    message, 
    {errors}
  )
}
