const ErrorModel = require("../common/models/errorModel");
const errorHandler = require("../common/errorHandler");
const httpStatus = require("http-status");

/**
 * Handle errors in the request pipeline.
 */
const handler = (error, req, res, next) => {
	error.path = req.path;
	error.sessionId = req.sessionID;
	errorHandler.handleError(error);
	next(error);
};

/**
 * Send a response according to the error raised.
 */
const responder = async (error, req, res, next) => {
	if (!isNaN(error.httpCode)) {
		let errorModel = new ErrorModel(error.name, error.message, error.httpCode);
		res.status(error.httpCode).send(errorModel);
	} else {
		next(error);
	}
};

/**
 * Act as the last handler to unhandled exceptions.
 */
const failSafeHandler = async (error, req, res, next) => {
	let errorModel = new ErrorModel(error.name, error.message, error.httpCode);
	res.status(httpStatus.INTERNAL_SERVER_ERROR).send(errorModel);
};

module.exports = { handler, responder, failSafeHandler };
