var fs = require('fs')
  , path = require('path')
  , jade = require('jade');

module.exports = {
  render: function(template, locals) {
    var str = fs.readFileSync(path.join(__dirname, 'views', template + '.jade'), 'utf8');
    return jade.compile(str)(locals);
  }
}