const app = require("./app");
const { logger } = require("./common/logger");
const setup = require("./scripts/setup");

const PORT = process.env.PORT || 3000;

(async () => {
	await setup.setupDatabase();
})().then(() => {
	app.listen(PORT, () => {
		// TODO: Use a better startup message here.
		logger.info(`Backend server listening on http://localhost:${PORT}`);
	});
});
