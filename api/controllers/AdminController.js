/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	'Admin':function(req, res){
 		sails.log("Before logIn()");
 		Parse.User.enableUnsafeCurrentUser();
 		Parse.User.logIn("Arthur", "papayo", {
 			success: function(user) {
 				sails.log("user is Admin: "+user.get('admin'));
			},
			error: function(user, error) {
    			sails.log("user: "+user+" error: "+error)
			}
		});
 		res.view('Admin/index');
 	}

 };

