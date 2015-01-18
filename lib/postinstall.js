var fs = require('fs');
var clc = require('cli-color');
var error = clc.red.bold;
var success = clc.green;

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

fs.mkdir(process.env.HOME + '/.wraithc', 0755, function(err) {
  if (err && err.errno !== 47) {
    console.log(error('There seems to be an error with your home folder permissions'));
  } else {
    console.log(success('You\'re good to go!'))
  }
});