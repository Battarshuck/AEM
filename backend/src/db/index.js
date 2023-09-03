const { Pool } = require("pg");
const { logger } = require("../common/logger");
const config = require("config");

const pool = new Pool({
	user: config.get("postgres.aem.user"),
	password: config.get("postgres.aem.password"),
	database: config.get("postgres.aem.database"),
	port: config.get("postgres.port"),
	host: config.get("postgres.host"),
});

/**
 * Execute a given SQL query.
 * @param {string} queryText SQL query.
 * @param {string} params Parameters to the SQL script, if any.
 * @returns 
 */
const query = async (queryText, params) => {
	const start = Date.now();
	logger.debug(`Executing query:\n${queryText}`);
	const res = await pool.query(queryText, params);
	const duration = Date.now() - start;
	logger.debug("Query executed", { text: queryText, duration, rows: res.rowCount });
	return res;
};

module.exports = { pool, query };
