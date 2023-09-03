const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const AuthenticationError = require("../../../common/errors/authenticationError");
const DatabaseError = require("../../../common/errors/databaseError");
const { logger } = require("../../../common/logger");
const { getSqlStmt, sqlPaths } = require("../../../common/sqlUtil");
const { query } = require("../../../db");

const person = [
	{
		username: "emmallison13@gmail.com",
		password: "password",
	},
	{
		username: "emmallison@gmail.com",
		password: "password",
	},
];

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
		// TODO: Encrypt password using bcrypt and save it in the database.
		const insertScript = await getSqlStmt(sqlPaths.insert);
		let values = [
			"'accounts'",
			"'email,password'",
			`'${credentials.email}, '${credentials.password}'`,
		];

		logger.debug(`Executing ${insertScript}`);

		let result = await query(insertScript, values);

		if (!result.rows[0]) {
			throw new DatabaseError("Could not add user to the database", false);
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
}

module.exports = new AccountService();
