const { Client } = require("pg");
const config = require("config");
const errorHandler = require("../common/errorHandler");

const masterClient = new Client({
	user: config.get("postgres.master.user"),
	password: config.get("postgres.master.password"),
	database: config.get("postgres.master.database"),
	port: config.get("postgres.port"),
	host: config.get("postgres.host"),
});

try {
	await masterClient.connect();
} catch (error) {
	errorHandler.handleError(error);
}
// TODO: Connect to PostgreSQL backend server using master database.
// TODO: Check if AEM PostgreSQL user role exists, and create a new one if it doesn't.
// TODO: Check if AEM's database exists. If it doesn't, create a new one with required tables and schema.
