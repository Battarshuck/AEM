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

const aemClient = new Client({
	user: config.get("postgres.aem.user"),
	password: config.get("postgres.aem.password"),
	database: config.get("postgres.aem.database"),
	port: config.get("postgres.port"),
	host: config.get("postgres.host"),
});

const aemDatabaseExists = async () => {
	logger.debug("Checking if AEM database exists");

	var sqlScript = getSqlStmt(sqlPaths.aemDatabaseExists);
	logger.debug(`Executing ${sqlScript}`);

	var result = await masterClient.query(sqlScript);

	if (result.rows[0].count !== "0") {
		logger.debug(
			`Database exists. Query returned count: ${result.rows[0].count}`
		);
		return true;
	} else {
		logger.debug(
			`Database does not exist. Query returned count: ${result.rows[0].count}`
		);
		return false;
	}
};

const aemUserExists = async () => {
	logger.debug("Checking if AEM user exists in PostgreSQL server");

	var sqlScript = getSqlStmt(sqlPaths.aemUserExists);
	logger.debug(`Executing ${sqlScript}`);

	var result = await masterClient.query(sqlScript);

	if (result.rows[0].count !== "0") {
		logger.debug(`User exists. Query returned count: ${result.rows[0].count}`);
		return true;
	} else {
		logger.debug(
			`User does not exist. Query returned count: ${result.rows[0].count}`
		);
		return false;
	}
};

const createAemDatabase = async () => {
	logger.debug("Creating AEM database");

	var sqlScript = getSqlStmt(sqlPaths.createAemDatabase);

	await masterClient.query(sqlScript);
	logger.debug("AEM database created");
};

const createAemPostgresUser = async () => {
	logger.debug("Creating AEM user for PostgreSQL");

	var sqlScript = getSqlStmt(sqlPaths.createAemUser);

	await masterClient.query(sqlScript);
	logger.debug("AEM user created");
};

const createAemIdentityRelations = async () => {
	logger.debug("Creating AEM identity schema and tables");

	var sqlScript = getSqlStmt(sqlPaths.createIdentityRelations);
	logger.debug(`Executing ${sqlScript}`);

	await aemClient.query(sqlScript);
	logger.debug("AEM identity schema and tables created");
};

const setupDatabase = async () => {
	logger.info("Beginning AEM database setup");

	// Connect to master database.
	try {
		logger.debug("Connecting to the master database as superadmin", {
			database: config.get("postgres.master.database"),
			superadmin: config.get("postgres.master.user"),
		});
		await masterClient.connect();
		logger.debug(
			"Successfully connected to the master database as superadmin",
			{
				database: config.get("postgres.master.database"),
				superadmin: config.get("postgres.master.user"),
			}
		);
	} catch (error) {
		error.isFatal = true;
		errorHandler.handleError(error);
	}

	// Create AEM user if it doens't exist.
	let userExists = await aemUserExists();
	if (userExists === false) {
		try {
			await createAemPostgresUser();
		} catch (error) {
			error.isFatal = true;
			errorHandler.handleError(error);
		}
	}

	// Create AEM database if it doesn't exist.
	let dbExists = await aemDatabaseExists();
	if (dbExists === false) {
		try {
			await createAemDatabase();
		} catch (error) {
			error.isFatal = true;
			errorHandler.handleError(error);
		}
	}

	// Connect to aem database.
	try {
		logger.debug("Connecting to aem's database", {
			database: config.get("postgres.aem.database"),
			user: config.get("postgres.aem.user"),
		});
		await aemClient.connect();
		logger.debug("Successfully connected to aem's database", {
			database: config.get("postgres.aem.database"),
			user: config.get("postgres.aem.user"),
		});
	} catch (error) {
		error.isFatal = true;
		errorHandler.handleError(error);
	}

	// Create AEM identity relations if they don't exist.

	try {
		await createAemIdentityRelations();
	} catch (error) {
		error.isFatal = true;
		errorHandler.handleError(error);
	}

	logger.info("Finished AEM database setup");
};

module.exports = { setupDatabase };
