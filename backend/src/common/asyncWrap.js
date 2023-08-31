/**
 * Wraps async functions for error handling.
 * @param {Promise} asyncFn 
 */
const wrap = (asyncFn) => {
  return async (req, res, next) => {
		try {
			return await asyncFn(req, res, next);
		} catch (error) {
			return next(error);
		}
	};
}

module.exports = wrap;