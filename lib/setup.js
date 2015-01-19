var jf = require('jsonfile');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var _ = require('underscore');
var chalk = require('chalk');
var error = chalk.bold.red;
var success = chalk.green;


var setUpObj = {
  questions: [
    {
      name: 'staticDir',
      message: 'The full path of where you want to locally store your static site. If it doesn\'t exist, we will make it' +
      ' for you.'
    }, {
      name: 'staticPort',
      message: 'The port you want your static files to be served on locally (to see how your site looks before you push it up)',
      default: 9000
    }, {
      name: 'ghostPort',
      message: 'The port that your local Ghost installation is running on',
      default: 2368
    }, {
      name: 'ghostDir',
      message: 'The full valid path of your current Ghost site (eg: /var/www/ghost)'
    }, {
      name: 'ghostArgs',
      message: 'The Node environment you wish to start Ghost with',
      choices: ['development', 'production']
    }, {
      name: 'ghUrl',
      message: 'The full valid path of the (empty) GitHub repo that you would like to push your static site to ' +
      '(eg: http://github.com/omarCA/wraith)'
    }, {
      name: 'cname',
      message: 'The CNAME that needs to be added for GitHub Pages'
    }

  ],
  wraithPath: function(name) {
    return path.join(process.env.HOME, '.wraithc', name + '.json');
  },
  fileExists: function(name, cb) {
    var wPath = this.wraithPath(name);
    fs.exists(wPath, function(exists) {
      cb.call(this, exists, name);
    }.bind(this));
  },
  testSetup: function(exists, name) {
    if (exists) {
      console.log(error('%s already exists!'), name);
    } else {
      this.setupPrompts(name);
    }
  },
  setupPrompts: function(name) {
    var wPath = this.wraithPath(name);
    inquirer.prompt(this.questions, function(answers) {
      _.extend(answers, { name: name });

      jf.writeFile(wPath, answers, function(err) {
        if (err) {
          console.log(error('Something went wrong! Please try again.'))
        } else {
          console.log(success('All good! %s is now ready to be possessed, spooked, and haunted!'), name);
        }
      })
    })
  },
  setup: function(name) {
    this.fileExists(name, this.testSetup);
  }
};

module.exports = setUpObj;