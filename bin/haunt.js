var exec = require('child_process').exec;
var path = require('path');

//json is placeholder for linking up with raghu's setup files
var Haunt = function(json){
  // variables:
  // using temp variables gitUrl and blogDir to test
  //!!!!!!! important, fill in gitUrl with a blank repo's url for testing!!!!!!
  this.gitUrl = 'temp';
  //./static needs to be changed to variable
  this.blogDir = path.resolve(process.cwd(), './static');
};

Haunt.prototype.hauntInit = function(gitUrl, callback){
  //git init
  //git remote add origin json.url
  var init = exec('git init', {cwd: this.blogDir});
  init.stdout.on('end', function(){
    var addOrigin = exec('git remote add origin '+ gitUrl, {cwd: this.blogDir});
    addOrigin.stdout.on('end', function(){
      console.log('git initialized, origin set to: ' + gitUrl);
      if(callback){
        callback(gitUrl);
      }
    });
  });
},

Haunt.prototype.push = function(gitUrl){
  console.log('target acquired, let the haunting being...')
  var add = exec('git add .', {cwd: this.blogDir});
  add.stdout.on('end', function(){
    //commit message needs to be changed for production
    var commit = exec("git commit -m 'wraith haunt test'", {cwd: this.blogDir}, function(){
      var push = exec('git push -u origin master', {cwd: this.blogDir}, function(error, stdout, stderr){
        if(error){
          console.log(error);
        } else {
          console.log(stdout, 'Haunting ' + gitUrl);
        }
      });
    });
  });
},

//haunt -- push static site to github
Haunt.prototype.haunt = function(){
    this.hauntInit(this.gitUrl, this.push);
}

module.exports = Haunt;

