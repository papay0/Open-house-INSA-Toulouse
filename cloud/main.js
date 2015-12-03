var moment = require('moment');

Parse.Cloud.define("getPresentations", function(request, response){
	var Presentations = Parse.Object.extend("Presentations");
	var query = new Parse.Query(Presentations);
	query.find({
		success: function(results) {
			response.success(results);
		},
		error: function(error) {
			response.error(error);
		}
	});
});

Parse.Cloud.define("logOut", function(request, response){
	if (request.user){
		Parse.User.logOut()
		response.success("You're logged out");
	} else {
		response.error("Failed to logged out, you were not logged in.");
	}
});

Parse.Cloud.define("getPlanning", function(req, res){
	if(req.user){
		Parse.User.current().fetch().then(function (user) {
			var query = user.relation("selectedPrs").query();
		    query.find({
				success: function(results) {
					response.success(results);
				},
				error: function(error) {
					response.error(error);
				}
			});
		});
	}else{
		response.error("You are not logged in "+error.message);
	}
}),

Parse.Cloud.define("suscribePresentation", function(request, response){
	if (request.user){
		var presentations = Parse.Object.extend("Presentations");
		var query = new Parse.Query(presentations);
		query.get(request.params.presentationId, {
			success: function(object) {
				var presentation = object;
				var user = Parse.User.current();
				var relation = user.relation("selectedPrs");
				relation.add(presentation);
				user.save(null, {
					success: function(presentation) {
						response.success(" Presentation suscribed ");
					},		
					error: function(presentation, error) {
						response.error("Failed to add presentation Object in Parse database: "+error.message);
					}
				});
			},
			error: function(object, error) {
				response.error("Failed to fin presentation Object with ID in Parse database: "+request.params.presentationID+"  &&   "+error.message);
			}
		});
	} else {
		response.error("You are not logged in "+error.message);
	}
});

Parse.Cloud.define("isAdmin", function(request, response) {
	if (request.user && request.user.get('admin')){
		response.success("[isAdmin] You're connected");
	} else {
		response.error("Authentication failed");
	}
});

Parse.Cloud.define("updatePresentation", function(request, response) {
	if (request.user && request.user.get('admin')){
		if (request.params.name && request.params.start && request.params.end && request.params.id){
			var name = request.params.name;
			var id = request.params.id;
			var start = new Date(request.params.start);
			var end = new Date(request.params.end);
			var presentations = Parse.Object.extend("Presentations");
			var query = new Parse.Query(presentations);
			console.log("id: "+id);
			
			query.get(id, {
				success: function(object) {
					object.set("name", name);
					object.set("start", start);
					object.set("end", end);
					console.log('start: '+start);
					object.save(null, {
						success: function(presentation) {
							response.success("Presentation updated: "+presentation);
						},		
						error: function(presentation, error) {
							response.error("Failed to update presentation Object in Parse database: "+error.message);
						}
					});
				},
				error: function(object, error) {
					response.error("Cannot find object by id");
				}
			});
		} else {
			response.error("Not enough arguments");
		}
	} else {
		response.error("You're not connected or not an admin");
	}
});

Parse.Cloud.define("createPresentation", function(request, response) {
	if (request.user && request.user.get('admin')){
		if (request.params.name && request.params.start && request.params.end){
			var format = "YYYY-MM-DD HH:mm";
			var name = request.params.name;
			var start = new Date(request.params.start);
			var end = new Date(request.params.end);
			var Presentation = Parse.Object.extend("Presentations");
			var presentation = new Presentation();
			presentation.set("name", name);
			presentation.set("start", start);
			presentation.set("end", end);
			console.log('start: '+start);

			presentation.save(null, {
				success: function(presentation) {
					response.success("Presentation added: "+presentation);
				},		
				error: function(presentation, error) {
					response.error("Failed to add presentation Object in Parse database: "+error.message);
				}
			});
		} else {
			response.error("You didn't give all the arguments.");	
		}
	} else {
		response.error("You need to be an administrateur to create a presentation!");
	}
});

Parse.Cloud.define("isConnected", function(request, response) {
	if (request.user){
		response.success("[isConnected] You're connected");
	} else {
		response.error("Authentication failed");
	}
});