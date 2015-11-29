module.exports = function(req, res, next) {

    Parse.Cloud.run('isAdmin', {}, {
      success: function(results) {
        sails.log("[Policies isAdmin success] Results: "+results)
        return next();
      },
      error: function(error) {
        sails.log("[Policies isAdmin error] Code: "+error.code+" Message: "+error.message);
       return res.redirect('/login');
      }
    });

};