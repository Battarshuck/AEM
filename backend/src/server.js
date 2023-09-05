const app = require("./app");
const { logger } = require("./common/logger");
const setup = require("./scripts/setup");

const PORT = process.env.PORT || 3000;

(async () => {
	await setup.setupDatabase();
})().then(() => {
	app.listen(PORT, () => {
		logger.info(
			`Agens Enterprise Manager server started. Listening on http://localhost:${PORT}`
		);
	});
});
