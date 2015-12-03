module.exports = function(req, res, next) {
	try {
		var currentUser = Parse.User.current();
		if (currentUser.get('admin')) {
			return next();
		} else {
			return res.view('Auth/loginAdmin', {
				nextPage : req.url
			});
		}
	} catch(error) {
		//sails.log("[Policies isAdmin error] Code: "+error.code+" Message: "+error.message);
		return res.view('Auth/loginAdmin', {
			nextPage : req.url
		});
	}
};