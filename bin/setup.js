var jf = require('jsonfile');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var _ = require('underscore');
var chalk = require('chalk');
var error = chalk.bold.red;
var success = chalk.green;
var setupconfig = require('./setupconfig');

var setUpObj = function(){
  this.questions = setupconfig.questions;
};

setUpObj.prototype.wraithPath: function(name) {
  return path.join(process.env.HOME, '.wraithc', name + '.json');
};

setUpObj.prototype.setup: function() {
  var self = this;
  inquirer.prompt(this.questions, function(answers) {
    var wPath = self.wraithPath(answers.name);

    jf.writeFile(wPath, answers, function(err) {
      if (err) {
        console.log(error('Something went wrong! Please try again.'))
      } else {
        console.log(success('All good! %s is now ready to be possessed, spooked, and haunted!'), answers.name);
      }
    })
  })
};

module.exports = setUpObj;