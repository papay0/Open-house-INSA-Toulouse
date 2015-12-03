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

 	registerUser:function(req, res) {
 		sails.log(req.param('email'));
 		var user = new Parse.User();
		user.set("username", req.param('email'));
		user.set("password", req.param('email'));
		//user.set("email", req.param('email'));
		user.set("admin", false);

		user.signUp(null, {
			success: function(user) {
				return res.redirect('/');
			},
			error: function(user, error) {
				sails.log("Error: register " + error.code + " " + error.message);
				res.view('500', {error : "Error: register " + error.code + " " + error.message});
			}
		});
	},

 	login: function(req, res) {
 		/*
		I think it's better to use Parse.User.logIn than cloud code function.
		Because I think it's more secure. 
		*/
		if (req.user == undefined){
			Parse.User.enableUnsafeCurrentUser();
			var email = req.param('email');
			var password = req.param('email');
			Parse.User.logIn(email, password, {
				success: function(user) {
					if(req.param('remember') == "ok"){
						sails.log("On met le cookie pour se souvenir de l'user");
						res.cookie('username', req.param('email'), { maxAge: 900000, httpOnly: true });
					}else{
						sails.log("On ne met pas de cookie");
					}
					sails.log(req.url);
					return res.redirect(req.param('nextPage'));
				},
				error: function(user, error) {
					res.view('500', {error : "Error: login " + error.code + " " + error.message});
					sails.log("user: "+user+" error: "+error+" email: "+email)
				}
			});
		}else{
			return res.redirect('/');
		}
	},

	logout: function(req, res) {
		res.clearCookie('username');
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