/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	 _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },
	
	'new': function(req, res){
		res.view();
	}
};

