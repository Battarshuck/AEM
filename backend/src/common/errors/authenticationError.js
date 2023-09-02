const AppError = require("./appError");
const httpStatus = require("http-status");

/**
 * An error thrown when the user login fails.
 */
class AuthenticationError extends AppError {
	/**
	 * Constructor.
	 * @param {string | undefined} message Error message.
	 */
	constructor() {
		super(httpStatus.UNAUTHORIZED, "Invalid email or password.", false);
		this.name = this.constructor.name;
	}
}

module.exports = AuthenticationError;
