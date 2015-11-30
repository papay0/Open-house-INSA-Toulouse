/**
 * PresentationsController
 *
 * @description :: Server-side logic for managing Presentations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	show: function(req, res){
 		Parse.Cloud.run('getPresentations', {}, {
 			success: function(results) {
 				res.view('index',{
 					presentations: results,
 				});
 			},
 			error: function(error) {
 				sails.log("Error: getPresentations " + error.code + " " + error.message);
 				res.view('500');
 			}
 		});
 	},

 	create: function(req, res){
 		var name = req.param('name');
 		var start = req.param('start');
 		var end = req.param('end');
 		sails.log(name+" "+start+" "+end);
 		Parse.Cloud.run('createPresentation', {name: name, start: start, end: end}, {
 			success: function(results) {
 				return res.redirect('/presentations');
 			},
 			error: function(error) {
 				sails.log("Error: createPresentations " + error.code + " " + error.message);
 				res.view('500');
 			}
 		});
 	}

 };

