module.exports = function(req, res, next) {
  sails.log("Cookie de l'user : " +req.cookies.username);

    Parse.Cloud.run('isConnected', {}, {
      success: function(results) {
        sails.log("[Policies isAuthenticated success] Results: "+results);
        return next();
      },
      error: function(error) {
        if (req.cookies.username != undefined){
          Parse.User.enableUnsafeCurrentUser();
          Parse.User.logIn('bastien.micheau', 'bastien.micheau', {
            success: function(user) {
              return next();
            },
            error: function(user, error) {
              res.clearCookie('username');
              sails.log("[Policies isAuthenticated error] Error: authentificated"+error);
              return res.redirect('/login');
            }
          });
        }else{
          sails.log("[Policies isAuthenticated error] Error: authentificated"+error);
          return res.redirect('/login');
        }
      }
    });

};