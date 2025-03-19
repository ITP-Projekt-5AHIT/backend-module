import winston from "winston";

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...args } = info;

    const ts = (timestamp as string).slice(0, 19).replace("T", " ");
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
    }`;
  })
);

const logger = winston.createLogger({
  level: winston.debug.toString(),
  format: alignedWithColorsAndTime,
  transports: [new winston.transports.Console({ level: "debug" })],
});

export default logger;
