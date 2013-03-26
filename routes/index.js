
/*
 * GET home page.
 */
var Project = db.model('Projects');

exports.index = function(req, res){
  Project.find({}, function(err, docs) {
    res.render('index', { projects: docs});
  });
};