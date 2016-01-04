module.exports = function(req, res, next) {
	try {
		var currentUser = Parse.User.current();
		if (currentUser.get('admin')) {
			return next();
		} else {
			return res.view('Admin/login', {
				nextPage : req.url,
			}, {
				layout: 'Admin/admin_login'});
		}
	} catch(error) {
		sails.log("[Policies isAdmin error] Code: "+error.code+" Message: "+error.message);
		return res.view('Admin/login', {
			nextPage : req.url,
			layout: 'Admin/admin_login'
		});
	}
};
