const bcrypt = require("bcrypt");
const database = require("./database");
const error = require("../../../common/errors");
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
		logger.info("Creating user account");

		// Check if email or username already exists.
		let exists = await database.usernameExists(credentials.username);
		if (exists === true)
			throw new error.ConflictError("Username is already in use.");

		exists = await database.emailExists(credentials.email);
		if (exists === true)
			throw new error.ConflictError("Email is already in use.");

		let encryptedPassword = await bcrypt.hash(credentials.password, 10);

		await database.insertAccount(
			credentials.email,
			credentials.username,
			encryptedPassword
		);

		logger.info("User account created");
	}

	/**
	 * Log into AEM.
	 * @param {*} credentials User login credentials.
	 */
	async login(credentials) {
		logger.info(`Attempting to log in user '${credentials.email}'`);
		var user = await database.getAccount(credentials.email);

		if (!user) {
			logger.error(
				`User ${credentials.email} tried logging in. User not found`
			);
			throw new error.AuthenticationError();
		}

		let authorised = await bcrypt.compare(credentials.password, user.password);
		if (authorised === false) {
			logger.error(
				`User ${credentials.email} login failed; Incorrect password`
			);
			throw new error.AuthenticationError();
		}

		// Add login audit to the database.
		await database.insertAccountLogin(user.id);
		
		// TODO: Add session when user logs in successfully.
		logger.info("Log in successful", { user: credentials.email });
	}
}

module.exports = new AccountService();
