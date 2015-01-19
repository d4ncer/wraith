#!/usr/bin/env node

/**
 * [wraith description]
 * @type {Object}
 */
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var program = require('commander');
var exec = require('child_process').exec;
var walk = require('walk');
var connect = require('connect');
var serveStatic = require('serve-static');
var haunt = require('./haunt');

program
  .version(require('../package.json').version)
  .option('-d, --dir <dir>', 'specify the directory to export assets', String)
  .option('-p, --port <port>', 'specify the port [2368]')
  .option('-sp --spookPort', 'sepecify the preview port [3000]')
  .option('possess', 'grabs generated static content from local ghost server')
  .option('spook', 'runs a preview of your static site')
  .option('haunt', 'init and push static site to github');

program
  .command('setup', 'setup wraith')
  .parse(process.argv);

// App variables
var port = program.port || '2368';
var spookPort = program.spookPort || '3000';
var domain = 'http://localhost:'+port;
var dir = program.dir || 'static';
var downloadDir = './'+dir;

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

// Function to download file using wget
var wgetFiles = function() {
  var wget =    "wget "+
                "--recursive "+ //follow links to download entire site
                "--convert-links "+ //make links relative
                "--page-requisites "+ // grab everything: css / inlined images
                "--no-parent "+ // don't go to parent level
                "--directory-prefix "+dir+" "+ // download contents to static/ folder
                "--no-host-directories "+ // don't create domain named folder
                "--restrict-file-name=unix "+ // don't escape query string
                "{0} "+domain;

  var child = exec(wget);
  
  child.stdout.on('end', function() {
    var walker = walk.walk(downloadDir, {followLinks: false});
    walker.on('file', fileHandler);
    walker.on('errors', errorsHandler);
    walker.on('end', endHandler);
    console.log('finished downloading to ' + downloadDir);
  });
};

var serveStaticSite = function() {
  var app = connect();

  app.use(serveStatic(downloadDir));
  app.listen(spookPort);
};

if (program.possess) { 
  console.log('possessing...');
  wgetFiles();
}

if (program.spook) {
  console.log('spooking...at port: '+spookPort);
  serveStaticSite();
}

if (program.haunt) {
  haunt.haunt();
}