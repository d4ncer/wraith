/**
 * [wraith description]
 * @type {Object}
 */
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;

// App variables
var file_url = 'http://localhost:2368';
var DOWNLOAD_DIR = './static/';

// Function to download file using wget
download_file_wget = function() {

    // extract the file name
    // var file_name = url.parse(file_url).pathname.split('/').pop();
    // compose the wget command
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

download_file_wget();

