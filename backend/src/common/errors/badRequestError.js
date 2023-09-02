const AppError = require("./appError");
const httpStatus = require("http-status");

/**
 * An error thrown when the user/client sends an invalid
 * request.
 */
class BadRequestError extends AppError {
	/**
	 * Constructor.
	 * @param {string | undefined} message Error message.
	 */
	constructor(message) {
		super(httpStatus.BAD_REQUEST, message, false);
		this.name = this.constructor.name;
	}
}

module.exports = BadRequestError;
