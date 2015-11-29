module.exports = function(req, res, next) {
  var bcrypt = require('bcrypt');  
  
  if (req.session["x-parse-session-token"]) {
    var hash = req.session["isAdmin"];
    sails.log("hash: "+hash);
    sails.log(bcrypt.compareSync("true", hash));
    var isAdmin = bcrypt.compareSync("true", hash);
    if (isAdmin){
      return next();
    } else {
      return res.forbidden();
    }
  } else {
      return res.redirect('/login');
  }
};