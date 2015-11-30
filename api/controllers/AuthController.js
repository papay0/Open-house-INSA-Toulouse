/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var passport = require('passport');

	const PASSWD = "password";

 module.exports = {


 	_config: {
 		actions: false,
 		shortcuts: false,
 		rest: false
 	},

 	register:function(req, res) {
 		res.view('Auth/register');
 	},

 	registerUser:function(req, res) {
 		sails.log(req.param('email'));
 		var user = new Parse.User();
		user.set("username", req.param('email'));
		user.set("password", PASSWD);
		//user.set("email", req.param('email'));
		user.set("admin", false);

		user.signUp(null, {
			success: function(user) {
				return res.redirect('/presentations');
			},
			error: function(user, error) {
				sails.log("Error: register " + error.code + " " + error.message);
				res.view('500');
			}
		});
	},

 	login: function(req, res) {
 		/*
			I think it's better to use Parse.User.logIn then cloud code function.
			Because I think it's more secude. 
			*/
			Parse.User.enableUnsafeCurrentUser();
			var email = req.param('email');
			var password = req.param('password');
			Parse.User.logIn(email, password, {
				success: function(user) {
					return res.redirect('/');
				},
				error: function(user, error) {
					res.send(error, 401);
					sails.log("user: "+user+" error: "+error+" email: "+email)
				}
			});
		},

	logout: function(req, res) {
		try {
			var currentUser = Parse.User.current();
			if (currentUser) {
				Parse.User.logOut();
				sails.log("I log out");
				return res.redirect('/login');
			} else {
				sails.log("You were not logged in");
				return res.redirect('/login');
			}
		} catch(error) {
			sails.log("You were not logged in");
			return res.redirect('/login');
		}
	}
};