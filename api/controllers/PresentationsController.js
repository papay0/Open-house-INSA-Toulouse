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

 	suscribePresentation: function(req, res){
 		Parse.Cloud.run('suscribePresentation', {presentationId : req.param('presentationId')}, {
 			success: function(results) {
 				sails.log("On a réussi ! " + results);
 				return res.redirect('/');
 			},
 			error: function(error) {
 				sails.log("Error: getPresentations " + error.code + " " + error.message);
 				res.view('500');
 			}
 		});
 	},

 	createPost: function(req, res){
 		sails.log("PresentationsController --> create");
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
 	},

 	create: function(req, res){
 		//sails.log("PresentationsController --> createDisplayForm");
 		 res.view('Presentation/create', {
 		 	layout: 'Admin/admin'
 		 })
 		//res.locals.layout = 'Admin/admin';
 		//res.view('Admin/index', {layout: 'Admin/admin'});
 		//res.view('Admin/index');

 	},

 	edit: function(req, res){
 		Parse.Cloud.run('getPresentations', {}, {
 			success: function(results) {
 				res.view('Presentation/edit',{
 					presentations: results,
 					layout: 'Admin/admin'
 				});
 			},
 			error: function(error) {
 				sails.log("[Edit] Error: getPresentations " + error.code + " " + error.message);
 				res.view('500');
 			}
 		});
 	}

 };

