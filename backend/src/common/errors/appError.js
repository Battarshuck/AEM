/**
 * Errors thrown from the application.
 */
class AppError extends Error {
	/**
	 * Constructor.
	 * @param {number} httpCode HTTP status code to return if this error
	 * is thrown.
	 * @param {string | undefined} message Error message
	 * @param {boolean} isFatal Indicates whether the application should terminate
	 * if this error is thrown.
	 */
	constructor(httpCode, message, isFatal) {
		super(message);
		this.name = this.constructor.name;
		this.httpCode = httpCode;
		this.isFatal = isFatal;
	}
}

AppError.prototype = Object.create(Error.prototype);

module.exports = AppError;
