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
      name: 'name',
      message: 'The name of your Wraith instance (eg: myBlog, ghostBlog). Must be unique!',
      validate: function(name) {
        var testPath = setUpObj.wraithPath(name);
        return !fs.existsSync(testPath);
      }
    },
    {
      name: 'staticDir',
      message: 'The full path of where you want to locally store your static site. If it doesn\'t exist, we will make it' +
      ' for you.',
      validate: function(sDir) {
        return !fs.existsSync(path.join(sDir, '.git'));
      }
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
      type: 'list',
      name: 'ghostArgs',
      message: 'The Node environment you wish to start Ghost with',
      choices: [ "development", "production" ]
    }, {
      name: 'gitUrl',
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
  setup: function() {
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
  }
};

module.exports = setUpObj;