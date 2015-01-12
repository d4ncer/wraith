#!/usr/bin/env node

/**
 * [wraith description]
 * @type {Object}
 */
var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var exec = require('child_process').exec;
var walk = require('walk');
var walker = walk.walk('./static', {followLinks: false});

// App variables
var file_url = 'http://localhost:2368';
var DOWNLOAD_DIR = './static/';

// Function to download file using wget
var download_file_wget = function() {
    var wget =    "wget "+
                  "--recursive "+ //follow links to download entire site
                  "--convert-links "+ //make links relative
                  "--page-requisites "+ // grab everything: css / inlined images
                  "--no-parent "+ // don't go to parent level
                  "--directory-prefix static "+ // download contents to static/ folder
                  "--no-host-directories "+ // don't create domain named folder
                  "--restrict-file-name=unix "+ // don't escape query string
                  "{0} "+file_url;

    var child = exec(wget, function(err, stdout, stderr) {
        if (err) throw err;
        else console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
    });
};

var fileHandler = function(DOWNLOAD_DIR, fileStat, next) {
  var name = fileStat.name.split("?")[0];
  var oldPath = path.resolve(DOWNLOAD_DIR, fileStat.name);
  var newPath = path.join(DOWNLOAD_DIR, name);
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

download_file_wget();

walker.on("file", fileHandler);
walker.on("errors", errorsHandler);
walker.on("end", endHandler);
