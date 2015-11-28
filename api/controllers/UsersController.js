/**
 * UsersController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'Login':function(req, res){
 		sails.log("Email: "+req.param("email"));
 		var email = req.param('email');
 		var password = req.param('password');
 		Parse.User.enableUnsafeCurrentUser();
 		Parse.User.logIn(email, password, {
 			success: function(user) {
 				sails.log("user is Admin: "+user.get('admin'));
 				if (user.get('admin')){
 					res.view('Admin/index');
 				} else {
 					res.view('index');
 				}
			},
			error: function(user, error) {
				res.view('500');
    			sails.log("user: "+user+" error: "+error+" email: "+email)
			}
		});
 	}
	
};

