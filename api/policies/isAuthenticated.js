module.exports = function(req, res, next) {

    Parse.Cloud.run('isConnected', {}, {
      success: function(results) {
        sails.log("results: "+results)
        return next();
      },
      error: function(error) {
        sails.log("error: "+error)
       return res.redirect('/login');
      }
    });

};