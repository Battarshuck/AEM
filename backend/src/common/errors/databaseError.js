const AppError = require("./appError");
const httpStatus = require("http-status");

/**
 * An error that occurred when executing a database
 * query isn't successful.
 */
class DatabaseError extends AppError {
	/**
	 * Constructor.
	 * @param {string | undefined} message Error message.
	 * @param {boolean} isFatal Indicates whether the application should terminate
	 * if this error is thrown.
	 */
	constructor(message, isFatal) {
		super(httpStatus.INTERNAL_SERVER_ERROR, message, isFatal);
		this.name = this.constructor.name;
	}
}

module.exports = DatabaseError;
