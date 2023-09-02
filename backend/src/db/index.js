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

const query = async (text, params) => {
	const start = Date.now();
	const res = await pool.query(text, params);
	const duration = Date.now() - start;
	logger.debug("Query executed", { text, duration, rows: res.rowCount });
	return res;
};

module.exports = { pool, query };
