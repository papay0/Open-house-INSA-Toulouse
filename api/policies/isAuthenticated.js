module.exports = function(req, res, next) {

    Parse.Cloud.run('isConnected', {}, {
      success: function(results) {
        sails.log("[Policies isAuthenticated success] Results: "+results)
        return next();
      },
      error: function(error) {
        sails.log("[Policies isAuthenticated error] Error: authentificated"+error)
       return res.redirect('/login');
      }
    });

};