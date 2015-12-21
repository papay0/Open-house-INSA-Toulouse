/**
* PresentationsController
*
* @description :: Server-side logic for managing Presentations
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {

  show: function(req, res){
    Parse.Cloud.run('getPresentations', {}, {
      success: function(results) {
        res.view('index',{
          presentations: results,
        });
      },
      error: function(error) {
        sails.log("Error: getPresentations " + error.code + " " + error.message);
        res.view('500', {error : "Error: show " + error.code + " " + error.message});

      }
    });
  },

  showSingleView: function(req, res){
    Parse.Cloud.run('getPresentations', {}, {
      success: function(results) {
        res.view('singleView',{
          presentations: results,
        });
      },
      error: function(error) {
        sails.log("Error: getPresentations " + error.code + " " + error.message);
        res.view('500', {error : "Error: show " + error.code + " " + error.message});

      }
    });
  },

  //TODELETE
  gotoNotCloudCode: function(req, res){
    var presentationId = req.param('presentationId');
    var presentations = Parse.Object.extend("Presentations");
    var query = new Parse.Query(presentations);
    query.get(presentationId, {
      success: function(object) {
        if(object.get('geolocation') != null ){
          return res.view(null, {
            latitudeDestination : object.get('location').latitude,
            longitudeDestination : object.get('location').longitude
          });
        }else{
          res.view('500', {error : "Error: goto, maybe the location of the presentation is not defined yet "});
        }
      },
      error: function(object, error) {
        sails.log("Error: getPresentations " + error.code + " " + error.message);
        res.view('500', {error : "Error: presentation not found" + error.code + " " + error.message});
      }
    });
  },

  goto: function(req, res){
    var presentationId = req.param('presentationId');
    Parse.Cloud.run('goto', {presentationId: presentationId}, {
      success: function(object) {
        if (object.get('location') != null){
          return res.view(null, {
            latitudeDestination : object.get('location').latitude,
            longitudeDestination : object.get('location').longitude
          });
        }else{
          sails.log("Error: The presentation have no location defined yet " + error.code + " " + error.message);
          res.view('500', {error : "Error: goto, maybe the location of the presentation is not defined yet " + error.code + " " + error.message});
        }
      },
      error: function(error) {
        sails.log("Error: goto, presentation not found " + error.code + " " + error.message);
        res.view('500', {error : "Error: presentation not found " + error.code + " " + error.message});
      }
    });
  },

  showPlanning: function(req, res){
    Parse.Cloud.run('getPlanning', {}, {
      success: function(results) {
        return res.view(null,{
          presentations: results
        });
      },
      error: function(error) {
        sails.log("Error: getPresentations " + error.code + " " + error.message);
        res.view('500', {error : "Error: Planning not found " + error.code + " " + error.message});
      }
    });
  },

  removePresentation: function(req, res){
    var presentationId = req.param('presentationId');
    sails.log("On enlève l'id "+presentationId+" du planning.");
    Parse.Cloud.run('removePresentation', {presentationId: presentationId}, {
      success: function(results) {
        return res.redirect('/planning');
      },
      error: function(error) {
        sails.log("Error: removePresentations " + error.code + " " + error.message);
        res.view('500', {error : "Error: Unable to remove presentation " + error.code + " " + error.message});
      }
    });
  },

  suscribePresentation: function(req, res){
    sails.log(req.param('presentationId'));
    var presentationId = req.param('presentationId');
    sails.log(presentationId);
    Parse.Cloud.run('suscribePresentation', {presentationId: presentationId}, {
      success: function(results) {
        sails.log("On a réussi ! " + results);
        return res.redirect('/');
      },
      error: function(error) {
        sails.log("Error: getPresentations " + error.code + " " + error.message);
        res.view('500', {error : "Error: Unable to suscribe to this presentation " + error.code + " " + error.message});
      }
    });
  },

  createPost: function(req, res){
    sails.log("PresentationsController --> create");
    var name = req.param('name');
    var start = req.param('start');
    var end = req.param('end');
    var fileElement =  req.file('picture');
    sails.log("Info form: "+name+" "+start+" "+end);
    fileElement.upload(function onUploadComplete (err, files) {
      if (err) return res.redirect('/500');;
      //sails.log("After err 1");
      var file = files[0];
      //sails.log("Log file1: "+file);
      //sails.log("Log file2: "+files);
      if (file !== undefined){
        //sails.log(file);
        var filePath = file.fd;
        //sails.log("file path = "+filePath);
        var fileName = file.filename;
        var fileSize = file.size;
        var contentType = file.type;
        //sails.log("Content-Type = "+contentType);
        if (fileSize > 0){
          sails.log("File size = " + fileSize);
          var fs = require('fs');
          var fileData = fs.readFileSync(filePath);
          fileData = Array.prototype.slice.call(new Buffer(fileData), 0);
          var newFile = new Parse.File(fileName, fileData);
          Parse.Cloud.run('createPresentation', {name: name, start: start, end: end, file: fileData, fileName: fileName}, {
            success: function(results) {
              return res.redirect('/presentations');
            },
            error: function(error) {
              sails.log("Error: createPresentations " + error.code + " " + error.message);
              res.view('500', {error : "Error: unable to create the presentation " + error.code + " " + error.message});
            }
          });
        }
      }
    });
  },
      //       sails.log("file = ");
      //       sails.log(file);
      //       newFile.save({
      //         success:function(){
      //           sails.log("File upload Successfully");
      //         }, error: function(file, error){
      //           sails.log("Error upload = "+error.message);
      //         }
      //       }).then(function(theFile){
      //         post.set("file", theFile);
      //         sails.log("ici je vais saver mon bazarre");
      //         post.save(null, {
      //           success: function(post) {
      //             sails.log('[.then success] New object created with objectId: ' + post.id);
      //             res.redirect('/501');
      //           },
      //           error: function(post, error) {
      //             sails.log('Failed to create new object, with error code: ' + error.message);
      //           }
      //         });
      //       });
      //     } else {
      //       post.save(null, {
      //         success: function(post) {
      //           sails.log('[else (>0)] New object created with objectId: ' + post.id);
      //           res.redirect('/502');
      //         },
      //         error: function(post, error) {
      //           sails.log('Failed to create new object, with error code: ' + error.message);
      //         }
      //       });
      //     }
      //   } else {
      //     res.redirect('/503');
      //   }
      // });
      // Parse.Cloud.run('createPresentation', {name: name, start: start, end: end}, {
      //   success: function(results) {
      //     return res.redirect('/presentations');
      //   },
      //   error: function(error) {
      //     sails.log("Error: createPresentations " + error.code + " " + error.message);
      //     res.view('500', {error : "Error: unable to create the presentation " + error.code + " " + error.message});
      //   }
      // });
    //},

    create: function(req, res){
      res.view('Presentations/create', {
        layout: 'Admin/admin'
      })
    },

    edit: function(req, res){
      Parse.Cloud.run('getPresentations', {}, {
        success: function(results) {
          res.view(null,{
            presentations: results,
            layout: 'Admin/admin'
          });
        },
        error: function(error) {
          sails.log("[Edit] Error: getPresentations " + error.code + " " + error.message);
          res.view('500', {error : "Error editing Presentation " + error.code + " " + error.message});
        }
      });
    },

    getPresentations: function(req, res){
      Parse.Cloud.run('getPresentations', {}, {
        success: function(results) {
          return res.json(results);
        },
        error: function(error) {
          res.view('500', {error : "Error getPresentations for React " + error.code + " " + error.message});
        }
      });
    },

    editPost: function(req,res){
      if (req.wantsJSON){
        var name = req.param('name');
        var start = req.param('start');
        var end = req.param('end');
        var id = req.param('id');
        sails.log("Params: name: "+name+" id: "+id+" start: "+ start+" end: "+end);
        Parse.Cloud.run('updatePresentation', {name: name, id: id, start: start, end: end}, {
          success: function(results) {
            sails.log("success to edit presentation, results: "+results);
            //return res.redirect('/presentations/edit');
            sails.log(results);
            return res.json(results);
          },
          error: function(error) {
            sails.log("[Edit] Error: updatePresentation " + error.code + " " + error.message);
            res.view('500', {error : "Error: Unable to edit this post " + error.code + " " + error.message});
          }
        });
      } else {
        sails.log("editPost, it's not a json ...")
        res.view('500', {error : "Error: editPost " + error.code + " " + error.message});
      }
    },

  };
