const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const uuid = require("uuid");
const { logger, stream } = require("./common/logger");
const accountRoute = require("./components/account/routes");
const errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");

const app = express();

app.use(express.json());
app.use(
	session({
		secret: "aem-backend",
		saveUninitialized: false,
		resave: true,
		genid: req => {
			return uuid.v4();
		},
	})
);

// Add session ID to the logger for a request scope.
app.use((req, res, next) => {
	logger.sessionId = req.sessionID;
	next();
});
app.use(morgan("dev", { stream: stream }));

app.use("/accounts", accountRoute);

app.use(errorHandlingMiddleware.handler);
app.use(errorHandlingMiddleware.responder);
app.use(errorHandlingMiddleware.failSafeHandler);

module.exports = app;
