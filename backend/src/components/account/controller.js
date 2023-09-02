const accountService = require("./service");

class AccountController {
	async signUp(req, res) {
		await accountService.createAccount(req.body);
		res.send("Account added successfully.");
	}

	async login(req, res) {
		await accountService.login(req.body);
		res.send("Login successful");
	}
}

module.exports = new AccountController();
