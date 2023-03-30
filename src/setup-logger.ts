import * as winston from 'winston';
const myFormatDev = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});
const myFormatProduction = winston.format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} ${level} ${message}`;
  },
);
export const devLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.label(),
    winston.format.colorize(),
    winston.format.timestamp({ format: 'MMM DD,YYYY HH:mm:ss' }),
    myFormatDev,
  ),
  transports: [new winston.transports.Console()],
});

export const productionLogger = winston.createLogger({
  level: 'warn',
  format: winston.format.combine(
    winston.format.label(),
    winston.format.colorize(),
    winston.format.timestamp({ format: 'MMM DD,YYYY HH:mm:ss' }),
    myFormatProduction,
  ),
  transports: [new winston.transports.File({ filename: 'error.log' })],
});
