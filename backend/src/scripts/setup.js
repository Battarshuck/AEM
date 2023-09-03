const config = require("config");
const { Client } = require("pg");
const errorHandler = require("../common/errorHandler");
const { logger } = require("../common/logger");
const { sqlPaths, getSqlStmt } = require("../common/sqlUtil");

const masterClient = new Client({
	user: config.get("postgres.master.user"),
	password: config.get("postgres.master.password"),
	database: config.get("postgres.master.database"),
	port: config.get("postgres.port"),
	host: config.get("postgres.host"),
});

const aemDatabaseExists = async () => {
	logger.info("Checking if AEM database exists");

	var sqlScript = getSqlStmt(sqlPaths.aemDatabaseExists);
	logger.debug(`Executing ${sqlScript}`);

	var result = await masterClient.query(sqlScript);

	if (result.rows[0].count !== "0") {
		logger.info(
			`Database exists. Query returned count: ${result.rows[0].count}`
		);
		return true;
	} else {
		logger.warn(
			`Database does not exist. Query returned count: ${result.rows[0].count}`
		);
		return false;
	}
};

const aemUserExists = async () => {
	logger.info("Checking if AEM user exists in PostgreSQL server");

	var sqlScript = getSqlStmt(sqlPaths.aemUserExists);
	logger.debug(`Executing ${sqlScript}`);

	var result = await masterClient.query(sqlScript);

	if (result.rows[0].count !== "0") {
		logger.info(`User exists. Query returned count: ${result.rows[0].count}`);
		return true;
	} else {
		logger.warn(
			`User does not exist. Query returned count: ${result.rows[0].count}`
		);
		return false;
	}
};

const createAemDatabase = async () => {
	logger.info("Creating AEM database");

	var sqlScript = getSqlStmt(sqlPaths.createAemDatabase);

	await masterClient.query(sqlScript);
	logger.info("AEM database created");
};

const createAemPostgresUser = async () => {
	logger.info("Creating AEM user for PostgreSQL");

	var sqlScript = getSqlStmt(sqlPaths.createAemUser);

	var result = await masterClient.query(sqlScript);
	logger.info("AEM user created");
};

const setupDatabase = async () => {
	logger.info("Beginning AEM database setup");
	try {
		logger.info("Connecting to the master database as superadmin", {
			database: config.get("postgres.master.database"),
			superadmin: config.get("postgres.master.user"),
		});
		await masterClient.connect();
		logger.info("Successfully connected to the master database as superadmin", {
			database: config.get("postgres.master.database"),
			superadmin: config.get("postgres.master.user"),
		});
	} catch (error) {
		error.isFatal = true;
		errorHandler.handleError(error);
	}

	let dbExists = await aemDatabaseExists();
	if (dbExists === false) {
		try {
			await createAemDatabase();
		} catch (error) {
			error.isFatal = true;
			errorHandler.handleError(error);
		}
	}

	let userExists = await aemUserExists();
	if (userExists === false) {
		try {
			await createAemPostgresUser();
		} catch (error) {
			error.isFatal = true;
			errorHandler.handleError(error);
		}
	}
};

module.exports = { setupDatabase };
