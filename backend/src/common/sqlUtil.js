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
	aemDatabaseExists: "aem-database-exists.sql",
	aemUserExists: "aem-user-exists.sql",
	createAemDatabase: "create-aem-database.sql",
	createAemUser: "create-aem-user.sql",
	createIdentityRelations: "create-identity-relations.sql",
	insert: "insert.sql",
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
