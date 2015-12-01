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

Parse.Cloud.define("suscribePresentation", function(request, response){
	if (request.user){
		console.log("test");
		var presentations = Parse.Object.extend("Presentations");
		var query = new Parse.Query(presentations);
		//query.getObjectWithId(request.params.presentationID);
		query.get(request.params.presentationID, {
		  success: function(object) {
		    // object is an instance of Parse.Object.
		    //console.log("coucou");
		    var presentation = object;
		    //alert("Successfully retrieved scores.");
		    //Attention peut ne pas marcher
		    //var presentation = results;
		    // Peut-être que cette methode marche mieux !
		    /*for (var i = 0; i < results.length; i++) {
		      var object = object;
		      alert(object.id + ' - ' + object.get('playerName'));
		    }*/
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
		    // error is an instance of Parse.Error.
		  }
		});
		/*query.find({
		  success: function(results) {
		  	console.log("coucou");
		    alert("Successfully retrieved " + results.length + " scores.");
		    //Attention peut ne pas marcher
		    //var presentation = results;
		    // Peut-être que cette methode marche mieux !
		    for (var i = 0; i < results.length; i++) {
		      var object = results[i];
		      alert(object.id + ' - ' + object.get('playerName'));
		    }
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
		  error: function(error) {
		    response.error("Failed to find presentation Object in Parse database: "+error.message);
		  }
		});*/
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