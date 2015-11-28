
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
