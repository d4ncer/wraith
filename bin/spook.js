var serveStatic = require('serve-static');
var connect = require('connect');


var Spook = function(){
  //App Variables
  this.spookPort = program.spookPort || '3000';
};

Spook.prototype.spook = function() {
  var app = connect();

  app.use(serveStatic(downloadDir));
  app.listen(spookPort);
};

module.exports = Spook;