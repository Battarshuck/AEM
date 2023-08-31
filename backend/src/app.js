const express = require("express");
const session = require("express-session");
const httpStatus = require("http-status");
const morgan = require("morgan");
const uuid = require("uuid");
const { logger, stream } = require("./common/logger");
const wrap = require("./common/asyncWrap");
const commonErrors = require("./common/error/commonErrors");
const userRouter = require("./components/user/user");
const {
	handler,
	responder,
	failSafeHandler,
} = require("./middlewares/errorHandlingMiddleware");
const AppError = require("./common/error/appError");

const app = express();

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

app.use(handler);
app.use(responder);
app.use(failSafeHandler);

module.exports = app;
