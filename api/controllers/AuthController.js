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
 		Parse.Cloud.run('logOut', {}, {
 			success: function(results) {
 				Parse.User.logOut();
 				sails.log("results: "+results)
 				return res.redirect('/');
 			},
 			error: function(error) {
 				sails.log("[LogOut] Error: Code: "+error.code+" Message: "+error.message);
 				return res.send(error, 500);
 			}
 		});
 	} 
 };