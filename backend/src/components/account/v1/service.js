const bcrypt = require("bcrypt");
const database = require("./database");
const AuthenticationError = require("../../../common/errors/authenticationError");
const ConflictError = require("../../../common/errors/conflictError");
const { logger } = require("../../../common/logger");

/**
 * Service for account-related operations.
 */
class AccountService {
	/**
	 * Create a new account on AEM.
	 * @param {*} credentials User credentials containing the user's name
	 * and password.
	 */
	async createAccount(credentials) {
		// Check if email or username already exists.
		let exists = await database.usernameExists(credentials.username);
		if (exists === true)
			throw new ConflictError("Username is already in use.");

		exists = await database.emailExists(credentials.email);
		if (exists === true)
			throw new ConflictError("Email is already in use.");

		let encryptedPassword = await bcrypt.hash(credentials.password, 10);

		await database.insertAccount(credentials.email, credentials.username, encryptedPassword);
	}

	/**
	 * Log into AEM.
	 * @param {*} credentials User login credentials.
	 */
	async login(credentials) {
		// TODO:Compare input credentials with data from the database.

		var user = person.find(p => p.username == credentials.email);

		if (!user) {
			logger.error(
				`User ${credentials.email} tried logging in. User not found`
			);
			throw new AuthenticationError();
		}

		if (credentials.password !== user.password) {
			logger.error(
				`User ${credentials.email} login failed; Incorrect password`
			);
			throw new AuthenticationError();
		}

		// TODO: Add session when user logs in successfully.
	}
}

module.exports = new AccountService();
