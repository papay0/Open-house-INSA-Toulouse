
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("showPresentations", function(request, response){
		var Post = Parse.Object.extend("Presentations");
 		var query = new Parse.Query(Post);
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
	if (Parse.User.logOut()){
		response.success("You're logged out");
	} else {
		response.error("Failed to logged out");
	}
});

Parse.Cloud.define("isAdmin", function(request, response) {
    if (request.user && request.user.get('admin')){
    	response.success("You're connected");
    } else {
    	response.error("Authentication failed");
    }
});

Parse.Cloud.define("isConnected", function(request, response) {
    if (request.user){
    	response.success("You're connected");
    } else {
    	response.error("Authentication failed");
    }
});