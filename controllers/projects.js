var Projects = require('../models/project');

module.exports = {
  // save new project to mongoDB
  saveProj: function(socket) {
    socket.on('clicked', function(data) {
      var project     = new Projects();
      project.name    = data.name;
      project.active  = false;

      project.save(function(err, doc) {
        io.sockets.emit('sendme', {
          body: render('_projectAddBtn', { dataId: doc.id, dataName: doc.name })
        });
      });
    })
  },

  // delete project from mongoDB
  remProj: function(socket) {
    socket.on('deleteProject', function(data) {
      Projects.findById(data.id, function(err, doc) {
        doc.remove(function(err, doc) {
          // get all projects
          Projects.find({}, function(err, doc) {
            var data = '';
            // append them
            (doc).forEach(function(val, key) {
              data += render('_projectAddBtn', { dataId: val.id, dataName: val.name })
            });
            // re-rendering the project list
            io.sockets.emit('reloadProjects', { body: data });
          });
        });
      });
    })
  },

  // get the project name for the edit modal
  // private emit socket
  showProj: function(socket) {
    socket.on('showProjectName', function(data) {
      Projects.findById(data.id, function(err, doc) {
        socket.emit('loadProjectName', { body: doc.name, id: doc.id });
      });
    })
  },

  // update project
  updProj: function(socket) {
    socket.on('updateProject', function(data) {
      Projects.findById(data.id, function(err, doc) {
        doc.name = data.name;
        // save the project
        doc.save(function(err, doc) {
          // get all projects
          Projects.find({}, function(err, doc) {
            var data = '';
            // append them
            (doc).forEach(function(val, key) {
              data += render('_projectAddBtn', { dataId: val.id, dataName: val.name })
            });
            // re-rendering the project list
            io.sockets.emit('newProjectList', { body: data });
          });
        });
      });
    });
  }
}
