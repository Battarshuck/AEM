const config = require("config");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// Custom format to add the current session ID to the logs.
const sessionId = winston.format((info, opts) => {
	info.sessionId = logger.sessionId;

	return info;
});

const dailyRotateTransport = new DailyRotateFile({
	filename: "aem-backend-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxFiles: "21d",
	dirname: config.get("logger.path"),
	handleExceptions: true,
	format: winston.format.combine(
		winston.format.timestamp(),
		sessionId(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
});

const logger = winston.createLogger({
	level: config.get("logger.level"),
	transports: [dailyRotateTransport],
	defaultMeta: {
		application: config.get("application.name"),
		service: config.get("application.service"),
	},
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
			format: winston.format.combine(
				colorizeFormat,
				winston.format.errors({ stack: true }),
				sessionId(),
				winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				winston.format.printf(
					info =>
						`${info.timestamp} ${info.message} ${
							info.stack ?? ""
						}`
				)
			),
			handleExceptions: true,
		})
	);
}

module.exports = { logger, stream };
