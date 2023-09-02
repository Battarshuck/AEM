const Joi = require("joi");

/**
 * Validation schema for the sign up object.
 */
const signUpSchema = Joi.object({
	email: Joi.string().required().email(),

	password: Joi.string().required().min(8).max(64),

	repeatPassword: Joi.ref("password"),
})
	.with("password", "repeatPassword")
	.messages({
		"any.only": "{#label} must match {#valids}",
	});

/**
 * Validation schema for the login object.
 */
const loginSchema = Joi.object({
	email: Joi.string().required().email(),

	password: Joi.string().required().min(8).max(64),
});

module.exports = { signUpSchema, loginSchema };
