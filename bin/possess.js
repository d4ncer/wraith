var exec = require('child_process').exec;
var walk = require('walk');
var path = require('path');
var fs = require('fs');


//program is passed temporarily so that this will function
//json is placeholder for linking up with raghu's setup files
var Possess = function(program, json){
  this.port = '2368',
  this.domain = 'http://localhost:'+ this.port,
  this.dir = 'static',
  this.downloadDir = './'+ this.dir
}
 

// Function to download file using wget
Possess.prototype.possess = function() {
  var wget =    "wget "+
                "--recursive "+ //follow links to download entire site
                "--convert-links "+ //make links relative
                "--page-requisites "+ // grab everything: css / inlined images
                "--no-parent "+ // don't go to parent level
                "--directory-prefix "+this.dir+" "+ // download contents to static/ folder
                "--no-host-directories "+ // don't create domain named folder
                "--restrict-file-name=unix "+ // don't escape query string
                "{0} "+this.domain;

  var child = exec(wget);

  //child.stdout loses reference to this.downloadDir thus:
  var downloadDir = this.downloadDir;
  
  child.stdout.on('end', function() {
    console.log(this.downloadDir, typeof this.downloadDir);
    var walker = walk.walk(downloadDir, {followLinks: false});
    walker.on('file', fileHandler);
    walker.on('errors', errorsHandler);
    walker.on('end', endHandler);
    console.log('finished downloading to ' + downloadDir);
  });
};

var fileHandler = function(downloadDir, fileStat, next) {
  var name = fileStat.name.split("?")[0];
  var oldPath = path.resolve(downloadDir, fileStat.name);
  var newPath = path.join(downloadDir, name);
  fs.rename(oldPath, newPath, function(err) {
    if (err) {
      console.log("could not rename file");
      throw err;
    }
    next();
  });
};

var errorsHandler = function(root, nodeStatsArray, next) {
  nodeStatsArray.forEach(function(n) {
    console.error("[ERROR] " + n.name);
    console.error(n.error.message || (n.error.code + ": " + n.error.path));
  });
};

var endHandler = function() {
  console.log("all done!");
};

module.exports = Possess;