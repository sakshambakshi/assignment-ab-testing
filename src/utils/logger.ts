import winston from 'winston';
import 'winston-daily-rotate-file';

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'src/logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: process.env.LOG_ROTATION_TIME_LIMIT || '14d', // Keep logs for 14 days,
    maxSize:'10mb'
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        fileRotateTransport
    ]
});
