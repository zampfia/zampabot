import winston from "winston";
import { format } from "winston";

const fileFormat = format.combine(
    format.timestamp(),
    format.printf((info) => {
        return `${info.timestamp} [${info.level}]: ${info.message}`;
    }),
);

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: "error",
            format: fileFormat,
            filename: "error.log",
        }),
        new winston.transports.File({
            level: "info",
            format: fileFormat,
            filename: "zambot.log",
        }),
        new winston.transports.File({
            level: "debug",
            format: fileFormat,
            filename: "debug.log",
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            level: "debug",
            format: format.combine(format.colorize(), fileFormat),
        }),
    );
}
