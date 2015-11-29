module.exports = function(req, res, next) {

    if (req.session["x-parse-session-token"]) {
    	return next();
    } else {
    	return res.redirect('/login');
    }
};