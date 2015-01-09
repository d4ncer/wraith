//configuration file
//store path names and other variables for access
var config = {}

//defaults
config.file_url = 'http://localhost:2368';
config.DOWNLOAD_DIR = './static/';

//set output directory
config.setOutput = function(dir){
  this.DOWNLOAD_DIR = dir;
};

//set ghost url
config.setUrl = function(url){
  this.file_url = url;
};

module.exports = config;