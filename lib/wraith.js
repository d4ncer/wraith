#!/usr/bin/env node
/*
 * [wraith description]
 * @type {Object}
 */

var _ = require('underscore');
var fs = require('fs');
var url = require('url');
var path = require('path');
var program = require('commander');
var exec = require('child_process').exec;
var walk = require('walk');

program
  .version(require('../package.json').version)
  .option('-d, --dir <dir>', 'specify the directory to export assets', String)
  .option('-p, --port <port>', 'specify the port [2368]');

program
  .command('setup', 'setup wraith')
  .parse(process.argv);

if(!program.args.length) {
    program.help();
} else {
    console.dir("Arguments: "+program.args);   
}

// App variables
var port = program.port || "2368";
var domain = 'http://localhost:'+port;
var dir = program.dir || 'static';
var downloadDir = './'+dir;

var config = require('./config');

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
  walker.on("file", fileHandler);
  walker.on("errors", errorsHandler);
  walker.on("end", endHandler);
  console.log('finished downloading to ' + downloadDir);

});


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

module.exports = wraith;
if (_.contains(program.args, 'generate')) { 
  wgetFiles();
}
