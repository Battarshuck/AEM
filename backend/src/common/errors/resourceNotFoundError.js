const AppError = require("./appError");
const httpStatus = require("http-status");

/**
 * An error thrown if a requested resource isn't found.
 */
class ResourceNotFoundError extends AppError {
	/**
	 * Constructor.
	 * @param {string | undefined} message Error message.
	 */
	constructor(message) {
		super(httpStatus.NOT_FOUND, message, false);
		this.name = this.constructor.name;
	}
}

module.exports = ResourceNotFoundError;
