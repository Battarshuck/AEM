const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// Custom format to add the current session ID to the logs.
const sessionId = winston.format((info, opts) => {
	info.sessionId = logger.sessionId;

	return info;
});

const dailyRotateTransport = new DailyRotateFile({
	level: "info",
	filename: "aem-backend-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxFiles: "21d",
	dirname: "./logs",
	handleExceptions: true,
	format: winston.format.combine(
		winston.format.timestamp(),
		sessionId(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
});

const logger = winston.createLogger({
	level: "http",
	transports: [dailyRotateTransport],
});

const stream = {
	write: message => {
		logger.info(message);
	},
};

if (process.env.NODE_ENV !== "production") {
	const colorizeFormat = winston.format.colorize({
		colors: {
			info: "white",
			error: "red",
			warning: "yellow",
			debug: "gray",
		},
		message: true,
	});

	logger.add(
		new winston.transports.Console({
			level: "debug",
			format: winston.format.combine(
				colorizeFormat,
				winston.format.errors({ stack: true }),
				sessionId(),
				winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				winston.format.printf(
					info => `${info.timestamp} ${info.sessionId} ${info.message}`
				)
			),
			handleExceptions: true,
		})
	);
}

module.exports = { logger, stream };
