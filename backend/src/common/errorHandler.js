const { logger } = require("./logger");
const AppError = require("./errors/appError");

/**
 * Centralised error handler.
 */
class ErrorHandler {
	constructor() {}

	/**
	 * Handle the raised error.
	 * @param {AppError | Error } error Error.
	 */
	handleError(error) {
		logger.error(error.message, {
			name: error.name,
			stack: error.stack,
			errors: error.errors,	// For aggregate errors.
		});
		crashIfErrorIsFatal(error.isFatal);
	}
}

const crashIfErrorIsFatal = isFatal => {
	if (isFatal === true) {
		process.exit(-1);
	}
};

module.exports = new ErrorHandler();
