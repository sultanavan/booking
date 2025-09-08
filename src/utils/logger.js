import { createLogger, format, transports } from "winston";
import fs from "fs";

// Ensure logs directory exists
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.Console({ level: "info" }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
