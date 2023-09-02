const Joi = require("joi");
const BadRequestError = require("../common/errors/badRequestError");

/**
 * Validate a given object schema using Joi.
 * @param {Joi.ObjectSchema} schema Joi schema to validate.
 */
const validate = schema => (req, res, next) => {
	const { error } = schema.validate(req.body, {
		abortEarly: false,
		errors: { wrap: { label: "'" } },
	});
	if (error) {
		throw new BadRequestError(error.message);
	} else {
		next();
	}
};

module.exports = validate;
