/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var passport = require('passport');

 module.exports = {

 	_config: {
 		actions: false,
 		shortcuts: false,
 		rest: false
 	},

 	login: function(req, res) {
 		Parse.User.enableUnsafeCurrentUser();
 		var email = req.param('email');
 		var password = req.param('password');
 		Parse.User.logIn(email, password, {
 			success: function(user) {
 				var isAdmin = false;
 				if (user.get('admin')){
 					isAdmin = true;
 				} 
 				req.session["x-parse-session-token"] = user._sessionToken;
 				var bcrypt = require('bcrypt');
 				var hashIsAdmin = bcrypt.hashSync(isAdmin.toString(), 10);
 				req.session["isAdmin"] = hashIsAdmin;
 				res.send(user);
 			},
 			error: function(user, error) {
 				res.send(error, 401);
 				sails.log("user: "+user+" error: "+error+" email: "+email)
 			}
 		});
 	},

 	logout: function(req, res) {
 		if (req.session["x-parse-session-token"]) {
 			Parse.User.logOut();
 			req.session.destroy(function(err) {
 				return res.redirect('/');
 			});
 		} else {
 			req.session.destroy(function(err) {
 				return res.redirect('/');
 			});
 		}    	
 	} 
 };