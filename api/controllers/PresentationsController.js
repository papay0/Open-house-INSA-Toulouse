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

 	showPlanning: function(req, res){
 		Parse.User.current().fetch().then(function (user) {
		    var query = user.relation("selectedPrs").query();
		    query.find({
				success: function(results) {
					res.view(null, {
						presentations: results
					});
				},
				error: function(error) {
					sails.log("Error: getPresentations " + error.code + " " + error.message);
 					res.view('500');
				}
			});
		});
 	},

 	showPlanningCloudCode: function(req, res){
 		Parse.Cloud.run('getPlanning', {}, {
 			success: function(results) {
 				res.view(null,{
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
 		sails.log(req.param('presentationId'));
 		var presentationId = req.param('presentationId');
 		sails.log(presentationId);
 		Parse.Cloud.run('suscribePresentation', {presentationId: presentationId}, {
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
 		 res.view('Presentations/create', {
 		 	layout: 'Admin/admin'
 		 })
 	},

 	edit: function(req, res){
 		Parse.Cloud.run('getPresentations', {}, {
 			success: function(results) {
 				res.view(null,{
 					presentations: results,
 					layout: 'Admin/admin'
 				});
 			},
 			error: function(error) {
 				sails.log("[Edit] Error: getPresentations " + error.code + " " + error.message);
 				res.view('500');
 			}
 		});
 	},

 	editPost: function(req,res){
 		if (req.wantsJSON){
 			var name = req.param('name');
 			var start = req.param('start');
 			var end = req.param('end');
 			var id = req.param('id');
 			sails.log("Params: name: "+name+" id: "+req.param('id'));
 			Parse.Cloud.run('updatePresentation', {name: name, id: id, start: start, end: end}, {
 				success: function(results) {
 					sails.log("success to edit presentation, results: "+results);
 					//return res.redirect('/presentations/edit');
 					sails.log(results);
 					return res.json(results);
 				},
 				error: function(error) {
 					sails.log("[Edit] Error: updatePresentation " + error.code + " " + error.message);
 					res.view('500');
 				}
 			});
 		} else {
 			sails.log("editPost, it's not a json ...")
 			res.view('500');
 		}		
 	}

 };

