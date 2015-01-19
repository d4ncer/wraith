var fs = require('fs');
var chalk = require('chalk');
var error = chalk.bold.red;
var success = chalk.green;

fs.mkdir(process.env.HOME + '/.wraithc', 0755, function(err) {
  if (err && err.errno !== 47) {
    console.log(error('There seems to be an error with your home folder permissions'));
    console.log(error('Please make sure you\'re running this command with the right permissions'))
  } else {
    console.log(success('You\'re good to go!'))
  }
});