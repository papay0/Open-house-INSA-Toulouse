        var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        bcrypt = require('bcrypt');

        passport.serializeUser(function(user, done) {
          done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
          sails.log("id = "+id);
          done(null, false);
        });


        passport.use(new LocalStrategy({
          usernameField: 'email',
          passwordField: 'password'
        },

        function(email, password, done){
          Parse.User.enableUnsafeCurrentUser();
          Parse.User.logIn(email, password, {
            success: function(user) {
              sails.log("user is Admin: "+user.get('admin'));
              var isAdmin = false;
              if (user.get('admin')){
               isAdmin = true;
             } 
              var returnUser = {
                isAdmin: isAdmin,
                email:email,
                createdAt: "INSA",
                  id:1 // obligatoire, idk why ...
                };
                return done(null, returnUser, {
                  message: 'Logged In Successfully'
                });
              },
              error: function(user, error) {
              //res.view('500');
              return done(null, false, { message: 'Connection error: '+error+"(user: "+user+")" });
              sails.log("user: "+user+" error: "+error+" email: "+email)
            }
          });
        }
        ));
