const app = require("./app");
const { logger } = require("./common/logger");

const PORT = process.env.PORT || 3000;

// TODO: Add initial setup and check for database before starting the server.

app.listen(PORT, () => {
	// TODO: Use a better startup message here.
	logger.info(`Backend server listening on http://localhost:${PORT}`);
});
