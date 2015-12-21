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
      success: function(resultsAll) {
        Parse.Cloud.run('getPlanning', {}, {
          success: function(results) {
            res.view('singleView',{
              presentations: resultsAll,
              planning: results,
              user: Parse.User.current()
            });
          },
          error: function(error) {
            sails.log("Error: Planning not found " + error.code + " " + error.message);
            res.view('singleView',{
              presentations: resultsAll
            });
          }
        });
      },
      error: function(error) {
        sails.log("Error: getPresentations " + error.code + " " + error.message);
        res.view('500', {error : "Error: show " + error.code + " " + error.message});

      }
    });
  },

  gotopresentation: function(req, res){
    sails.log(req.param('lat'));
    sails.log(req.param('long'));
    res.view('Presentations/gotopresentation',{
      lat: req.param('lat'),
      long: req.param('long')
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
      var file = files[0];
      if (file !== undefined){
        var filePath = file.fd;
        var fileName = file.filename;
        var fileSize = file.size;
        var contentType = file.type;
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

  uploadPost: function(req, res){
    var name = req.param('name');
    var file = req.param('image');
    var file2 = req.file('image');
    var imageEdited = req.param('imageEdited');
    var cache = [];
    var a = JSON.stringify(file2, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = null;
    sails.log("JSON: "+a);
    sails.log("Image edited: "+imageEdited);
    sails.log("Params: name: "+name);
    sails.log("Params: image: "+file2);
    file2.upload(function onUploadComplete (err, files) {
      if (err) return res.redirect('/500');;
      var file = files[0];
      if (file !== undefined && imageEdited == true){
        var fileName = file.filename;
        sails.log("Params: fileName: "+fileName);
        var fileSize = file.size;
        if (fileSize > 0){
          sails.log("File size = " + fileSize);
          var fs = require('fs');
          var fileData = fs.readFileSync(filePath);
          fileData = Array.prototype.slice.call(new Buffer(fileData), 0);
          var newFile = new Parse.File(fileName, fileData);
        } else {
          sails.log("file undefined or image edited == false");
        }
      }
    });
  },

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
      var image = req.file('image');
      var imageEdited = req.param('imageEdited');
      sails.log("Params: name: "+name+" id: "+id+" start: "+ start+" end: "+end);
      sails.log("image: "+image);
      sails.log("Image edited: "+imageEdited);

      image.upload(function onUploadComplete (err, files) {
        sails.log("Je suis direct apres image.upload");
        if (err) return res.redirect('/500');;
        var file = files[0];
        sails.log("file: "+file);
        if (imageEdited == "true"){
          sails.log("I'm in imageEdited");
          if (file !== undefined){
          var filePath = file.fd;
          var fileName = file.filename;
          sails.log("Params: fileName: "+fileName);
          var fileSize = file.size;
          sails.log("File size = " + fileSize);
          if (fileSize > 0){
            sails.log("File size = " + fileSize);
            var fs = require('fs');
            var fileData = fs.readFileSync(filePath);
            fileData = Array.prototype.slice.call(new Buffer(fileData), 0);
            var newFile = new Parse.File(fileName, fileData);
            Parse.Cloud.run('updatePresentation', {name: name, id: id, start: start, end: end, file: fileData, fileName: fileName, imageEdited: imageEdited}, {
              success: function(results) {
                sails.log("success to edit presentation, results: "+results);
                //return res.redirect('/presentations/edit');
                //sails.log(results);
                return res.json(results);
              },
              error: function(error) {
                sails.log("[Edit image edited == true] Error: updatePresentation " + error.code + " " + error.message);
                res.view('500', {error : "Error: Unable to edit this post " + error.code + " " + error.message});
              }
            });
          } else {
            sials.log('fileSize <= 0');
          }
        } else {
          sails.log("file undefined");
        }
      } else {
          sails.log("image edited == false");
          Parse.Cloud.run('updatePresentation', {name: name, id: id, start: start, end: end, imageEdited: imageEdited}, {
            success: function(results) {
              sails.log("success to edit presentation, results: "+results);
              //return res.redirect('/presentations/edit');
              //sails.log(results);
              return res.json(results);
            },
            error: function(error) {
              sails.log("[Edit image edited == false] Error: updatePresentation " + error.code + " " + error.message);
              res.view('500', {error : "Error: Unable to edit this post " + error.code + " " + error.message});
            }
          });

        }
      });

    } else {
      sails.log("editPost, it's not a json ...")
      res.view('500', {error : "Error: editPost " + error.code + " " + error.message});
    }
  },

};
