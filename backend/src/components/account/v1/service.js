const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const { exist } = require("joi");
const AuthenticationError = require("../../../common/errors/authenticationError");
const ConflictError = require("../../../common/errors/conflictError");
const DatabaseError = require("../../../common/errors/databaseError");
const { logger } = require("../../../common/logger");
const { getSqlStmt, sqlPaths } = require("../../../common/sqlUtil");
const { query } = require("../../../db");

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
		let isAvailable = await this.#usernameIsAvailable(credentials.username);
		if (isAvailable === false)
			throw new ConflictError("Username is already in use.");

		isAvailable = await this.#emailIsAvailable(credentials.email);
		if (isAvailable === false)
			throw new ConflictError("Email is already in use.");

		let encryptedPassword = await bcrypt.hash(credentials.password, 10);

		const sqlQuery = getSqlStmt(sqlPaths.identity.insertUser);
		let values = [
			credentials.email,
			credentials.email.toUpperCase(),
			credentials.username,
			credentials.username.toUpperCase(),
			encryptedPassword,
		];

		let result = await query(sqlQuery, values);

		if (!result.rows[0]) {
			throw new DatabaseError("Could not add user to the database.", false);
		}
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

	async #usernameIsAvailable(username) {
		logger.info(`Checking username '${username}' for availability`, {
			username: username,
		});

		const sqlQuery = getSqlStmt(sqlPaths.identity.usernameExists);
		let values = [username.toUpperCase()];

		let result = await query(sqlQuery, values);

		if (result.rows[0].count !== "0") {
			logger.info("Username is not available");
			return false;
		}

		logger.info("Username is available");
		return true;
	}

	async #emailIsAvailable(email) {
		logger.info(`Checking email '${email}' for availability`, { email: email });

		const sqlQuery = getSqlStmt(sqlPaths.identity.emailExists);
		let values = [email.toUpperCase()];

		let result = await query(sqlQuery, values);

		if (result.rows[0].count !== "0") {
			logger.info("Email is not available");
			return false;
		}

		logger.info("Email is available");
		return true;
	}
}

module.exports = new AccountService();
