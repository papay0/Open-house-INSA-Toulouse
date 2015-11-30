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

Parse.Cloud.define("isAdmin", function(request, response) {
	if (request.user && request.user.get('admin')){
		response.success("[isAdmin] You're connected");
	} else {
		response.error("Authentication failed");
	}
});

Parse.Cloud.define("createPresentation", function(request, response) {
	if (request.user && request.user.get('admin')){
		if (request.params.name){
			var format = "YYYY-MM-DD HH:mm";
			var name = request.params.name;
			var start = Date();
			var end = Date();
		//var start = Date(moment(request.params.start).format("DD/MM/YYYY"));
		//var end = Date(moment(request.params.end).format("DD/MM/YYYY"));
		var Presentation = Parse.Object.extend("Presentations");
		var presentation = new Presentation();
		presentation.set("name", name);
		//presentation.set("start", start);
		//presentation.set("end", end);

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