const router = require("express").Router();
const accountController = require("./controller");
const wrap = require("../../common/asyncWrap");
const validate = require("../../middlewares/validationMiddleware");
const validation = require("./validation");

/**
 * Sign up.
 */
router.post(
	"/",
	validate(validation.signUpSchema),
	wrap(accountController.signUp)
);

/**
 * Login.
 */
router.post(
	"/login",
	validate(validation.loginSchema),
	wrap(accountController.login)
);

module.exports = router;
