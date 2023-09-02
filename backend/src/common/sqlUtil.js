const fileSystem = require("fs");
const path = require("path");
const AppError = require("./errors/appError");
const httpStatus = require("http-status");

/**
 * Base path to SQL scripts.
 */
const SQL_SCRIPT_BASE_PATH = path.join(
	__dirname,
	"../scripts/sql"
);

/**
 * Returns the content of the SQL file.
 * @param {string} fileName File name of SQL script.
 * @param  {...string} parentFolderNames List of parent folders to find the SQL
 * script from the base path in order.
 *
 * Example: Pass in `["inserts", "v1"]` for the given path:
 * `baseFolder/inserts/v1/insert.sql`.
 *
 * @returns {Promise<string>}
 */
const getSqlStmt = async (fileName, ...parentFolderNames) => {
	let sqlPath =
		parentFolderNames.length > 0
			? path.join(SQL_SCRIPT_BASE_PATH, ...parentFolderNames, fileName)
			: path.join(SQL_SCRIPT_BASE_PATH, fileName);

	if (!fileSystem.existsSync(sqlPath))
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			`SQL file not found. File name: ${fileName}. Path: ${sqlPath}`,
			false
    );

	return fileSystem.readFileSync(sqlPath);
};

module.exports = { getSqlStmt, SQL_SCRIPT_BASE_PATH };
