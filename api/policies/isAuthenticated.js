module.exports = function(req, res, next) {
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
            return res.view('Auth/login', {
              nextPage : req.url
            });
          }
        });
      }else{
        sails.log("[Policies isAuthenticated error] Error: authentificated"+error);
        backURL=req.header('Referer') || '/';
        sails.log(req.url);
        return res.view('Auth/login', {
          nextPage : req.url
        });
      }
    }
  });
};