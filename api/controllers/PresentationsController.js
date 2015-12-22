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

  createPostCloudCode: function(req, res){
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
        sails.log("info file = ");
        sails.log(file);
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
          Parse.Cloud.run('createPresentation', {name: name, start: start, end: end, file: fileData, fileName: fileName, newFile: newFile}, {
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

  createPost: function(req, res){
    sails.log("PresentationsController --> create");
    if (req.param('name') && req.param('start') && req.param('end') && req.param('description') && req.file('picture')){

      var name = req.param('name');
      var start = new Date(req.param('start'));
      var end = new Date(req.param('end'));
      var description = req.param('description');
      var fileElement =  req.file('picture');
      sails.log("Info form: "+name+" "+start+" "+end);
      var geoPointTest = new Parse.GeoPoint();
      var Presentation = Parse.Object.extend("Presentations");
      var presentation = new Presentation();
      presentation.set("name", name);
      presentation.set("start", start);
      presentation.set("end", end);
      presentation.set("description", description);
      presentation.set("location", geoPointTest);
      fileElement.upload(function onUploadComplete (err, files) {
        if (err) return res.redirect('/500');;
        var file = files[0];
        if (file !== undefined){
          sails.log("info file = ");
          sails.log(file);
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
            newFile.save({
              success:function(){
                console.log("File upload Successfully");
                //response.success("File upload Successfully");
              }, error: function(file, error){
                console.log("Error upload = "+error);
                res.view('500', {error : "Error: Unable to save this newFile " + error.code + " " + error});
                //response.error("Error upload = "+error);
              }
            }).then(function(theFile){
              presentation.set("image", theFile);
              presentation.save(null, {
                success: function(presentation) {
                  req.session.flash = {
                    success: "Presentation added successfully"
                  }
                  res.locals.flash = _.clone(req.session.flash);
                  sails.log("Success to add presentation, I redirect. "+ JSON.stringify(res.locals.flash));
                  return res.redirect('/presentations');
                },
                error: function(presentation, error) {
                  req.session.flash = {
                    err: "Error can't upload picture, error code: "+error.code+" details: "+error
                  }
                  res.locals.flash = _.clone(req.session.flash);
                  return res.redirect('/presentations');
                  //res.view('500', {error : "Error: Unable to add this presentation " + error.code + " " + error});
                  //response.error("Failed to add presentation Object in Parse database: "+error.message);
                }
              });
            });
          }
        }
      });
    } else {
      req.session.flash = {
        err: "Missing arguments"
      }
      res.locals.flash = _.clone(req.session.flash);
      sails.log("Error to add presentation, I redirect. "+ JSON.stringify(res.locals.flash));
      return res.redirect('/presentations');
    }
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
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = {};
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

  deletePost: function(req, res){
    if (req.wantsJSON){
      var id = req.param('id');
      sails.log("I delete the object id: "+id);
      Parse.Cloud.run('deletePresentation', {id: id}, {
        success: function(results) {
          sails.log("Success to delete presentation, results: "+results);
          return res.json(results);
        },
        error: function(error) {
          sails.log("[Delete presentation] Error: updatePresentation " + error.code + " " + error.message);
          res.view('500', {error : "Error: Unable to delete this presentation " + error.code + " " + error.message});
        }
      });
    } else {
      sails.log("I don't have JSON");
    }
  },

  editPost: function(req,res){
    if (req.wantsJSON){
      var name = req.param('name');
      var start = new Date(req.param('start'));
      var end = new Date(req.param('end'));
      var id = req.param('id');
      var description = req.param('description');
      var image = req.file('image');
      var imageEdited = req.param('imageEdited');
      sails.log("Params: name: "+name+" id: "+id+" start: "+ start+" end: "+end);
      sails.log("image: "+image);
      sails.log("Image edited: "+imageEdited);
      var presentations = Parse.Object.extend("Presentations");
      var query = new Parse.Query(presentations);

      image.upload(function onUploadComplete (err, files) {
        sails.log("Je suis direct apres image.upload");
        if (err) return res.redirect('/500');;
        if (imageEdited == "true"){
          var file = files[0];
          var filePath = file.fd;
          var fileName = file.filename;
          var fileSize = file.size;
          var contentType = file.type;
          var fs = require('fs');
          var fileData = fs.readFileSync(filePath);
          fileData = Array.prototype.slice.call(new Buffer(fileData), 0);
          var newFile = new Parse.File(fileName, fileData);
           sails.log("file ouside: ");
           sails.log(file);
          var that = this;
          sails.log("I'm in imageEdited");
          query.get(id, {
            success: function(object) {
              sails.log("file inside: ");
              sails.log(that.file);
              sails.log("name: "+name);
              object.set("name", name);
              object.set("start", start);
              object.set("end", end);
              object.set("description", description);

              console.log("[updatePresentation --> with file] Name of my file updated: "+fileName);
              console.log("[updatePresentation --> with file] info file: "+ file);
              newFile.save({
                success:function(){
                  console.log("[updatePresentation --> with file] File uploaded Successfully");
                  //return res.json();
                },
                error: function(file, error){
                  res.view('500', {error : "Failed to save the file presentation Object in Parse database: "+error.message});
                  console.log("[updatePresentation --> with file] Error upload = "+error);
                }
              }).then(function(theFile){
                object.set("image", theFile);
                object.save(null, {
                  success: function(presentation) {
                    console.log("[Update presentation --> with file]] File updated Successfully");
                    return res.json(presentation);
                  },
                  error: function(presentation, error) {
                    sails.log("I'm in error file.save (then), error: "+error.code+" error message: "+error.message);
                    res.view('500', {error : "Failed to update presentation Object in Parse database: "+error.message});
                  }
                });
              });
            },
            error: function(object, error) {
              response.error("Cannot find object by id");
            }
          });
    } else {
      sails.log("image edited == false");
      query.get(id, {
        success: function(object) {
          sails.log("I'm in success get by id, presentation: "+JSON.stringify(object));
          object.set("name", name);
          object.set("start", start);
          object.set("end", end);
          object.set("description", description);
          object.save(null, {
            success: function(presentation) {
              sails.log("I'm in success object. save");
              return res.json(presentation);
            },
            error: function(presentation, error) {
              sails.log("I'm in error object. save, error: "+error.code+" error message: "+error.message);
              res.view('500', {error : "Failed to update presentation Object in Parse database: "+error.message});
              //response.error("Failed to update presentation Object in Parse database: "+error.message);
            }
          });
        },
        error: function(object, error) {
          res.view('500', {error : "Cannot find object by id"});
          //response.error("Cannot find object by id");
        }
      });
    }
  });

} else {
  sails.log("editPost, it's not a json ...")
  res.view('500', {error : "Error: editPost " + error.code + " " + error.message});
}
},

editPostCloudCode: function(req,res){
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
      sails.log("file: ");
      sails.log(file);
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
