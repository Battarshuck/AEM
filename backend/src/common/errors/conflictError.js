const AppError = require("./appError");
const httpStatus = require("http-status");

/**
 * An error thrown if performing a given operation will result in
 * data inconsistencies or conflicts.
 */
class ConflictError extends AppError {
	/**
	 * Constructor.
	 * @param {string | undefined} message Error message.
	 */
	constructor(message) {
		super(httpStatus.CONFLICT, message, false);
		this.name = this.constructor.name;
	}
}

module.exports = ConflictError;
