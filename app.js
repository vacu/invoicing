var express = require('express')
  , http = require('http')
  , path = require('path')
  , jade = require('jade');

GLOBAL.mongoose = require('mongoose');
mongoose.set('debug', true);
GLOBAL.db = mongoose.createConnection('localhost', 'invoices');

// models
var Item     = require('./models/item')
  , Invoices = require('./models/invoice')
  , Projects = require('./models/project');

var routes = require('./routes')
  , app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app)
  , fs = require('fs')
  , proj = require('./controllers/projects')
  , inv = require('./controllers/invoices')
  , itm = require('./controllers/items');

// use everywhere
GLOBAL.io = require('socket.io').listen(server);
GLOBAL.render = require('./functions').render;

io.sockets.on('connection', function(socket) {
  // projects io calls and emits
  proj.saveProj(socket);
  proj.remProj(socket);
  proj.showProj(socket);
  proj.updProj(socket);

  // invoices io calls and emits
  inv.invShow(socket);
  inv.invShowData(socket);
  inv.invAdd(socket);
  inv.invDel(socket);
  inv.invUpd(socket);

  // items io calls and emits
  itm.saveItem(socket);
  itm.delItem(socket);
  itm.updItem(socket);
  itm.updTotalPrice(socket);
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
