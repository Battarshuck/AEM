const { logger } = require("../../../common/logger");
const { getSqlStmt, sqlPaths } = require("../../../common/sqlUtil");
const { query } = require("../../../db");

/**
 * Database operations class for accounts.
 */
class AccountDatabase {
	/**
	 * Check if the username exists in the database.
	 * @param {string} username Username
	 * @returns @see true if the username exists in the database, otherwise
	 * @see false.
	 */
	async usernameExists(username) {
		logger.debug(`Checking if username '${username}' exists`, {
			username: username,
		});

		const sqlQuery = getSqlStmt(sqlPaths.identity.usernameExists);
		let values = [username.toUpperCase()];

		let result = await query(sqlQuery, values);

		if (result.rows[0].count !== "0") {
			logger.debug("Username exists");
			return true;
		}

		logger.debug("Username does not exist");
		return false;
	}

	/**
	 * Check if the email exists in the database.
	 * @param {string} email Email.
	 * @returns @see true if the email exists in the database, otherwise
	 * @see false.
	 */
	async emailExists(email) {
		logger.debug(`Checking if email '${email}' exists`, { email: email });

		const sqlQuery = getSqlStmt(sqlPaths.identity.emailExists);
		let values = [email.toUpperCase()];

		let result = await query(sqlQuery, values);

		if (result.rows[0].count !== "0") {
			logger.debug("Email exists");
			return true;
		}

		logger.debug("Email does not exist");
		return false;
	}

	/**
	 * Insert account in the database.
	 * @param {string} email Account email.
	 * @param {string} username Account username.
	 * @param {string} encryptedPassword Encrypted password for account.
	 */
	async insertAccount(email, username, encryptedPassword) {
		const sqlQuery = getSqlStmt(sqlPaths.identity.insertUser);
		let values = [
			email,
			email.toUpperCase(),
			username,
			username.toUpperCase(),
			encryptedPassword,
		];

		let result = await query(sqlQuery, values);

		if (!result.rows[0]) {
			throw new DatabaseError("Could not add user to the database.", false);
		}
	}
}

module.exports = new AccountDatabase();
