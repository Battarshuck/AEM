const fileSystem = require("fs");
const path = require("path");
const AppError = require("./errors/appError");
const httpStatus = require("http-status");

/**
 * Base path to SQL scripts.
 */
const SQL_SCRIPT_BASE_PATH = path.join(__dirname, "../scripts/sql");

/**
 * Contains the paths for all available SQL files relative to the root
 * folder `scripts/sql`.
 */
const sqlPaths = {
	setup: {
		aemDatabaseExists: "setup/aem-database-exists.sql",
		aemUserExists: "setup/aem-user-exists.sql",
		createAemDatabase: "setup/create-aem-database.sql",
		createAemUser: "setup/create-aem-user.sql",
		createIdentityRelations: "setup/create-identity-relations.sql",
	},
	identity: {
		emailExists: "identity/email-exists.sql",
		insertUser: "identity/insert-user.sql",
		usernameExists: "identity/username-exists.sql",
	},
};

/**
 * Returns the content of the SQL file.
 * @param {string} filepath Relative path of the SQL script from the root
 * folder for SQL scripts, `scripts/sql`.
 * @returns {string}
 */
const getSqlStmt = filepath => {
	let sqlPath = path.join(SQL_SCRIPT_BASE_PATH, filepath);

	if (!fileSystem.existsSync(sqlPath))
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			`SQL file not found. File name: ${filepath}. Path: ${sqlPath}`,
			false
		);

	return fileSystem.readFileSync(sqlPath, { encoding: "utf-8" });
};

module.exports = { getSqlStmt, SQL_SCRIPT_BASE_PATH, sqlPaths };
