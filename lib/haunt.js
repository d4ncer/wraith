var exec = require('child_process').exec;
var path = require('path');

//variables:
//using temp variables gitUrl and blogDir to test
var gitUrl = 'https://github.com/minocys/tester.git';
var blogDir = path.resolve(process.cwd(), './static');


module.exports = {
  hauntInit : function(gitUrl, callback){
    //git init
    //git remote add origin json.url
    var init = exec('git init', {cwd: blogDir});
    init.stdout.on('end', function(){
      var addOrigin = exec('git remote add origin '+ gitUrl, {cwd: blogDir});
      addOrigin.stdout.on('end', function(){
        console.log('git initialized, origin set to: ' + gitUrl);
        if(callback){
          callback();
        }
      });
    });
  },

  push : function(){
    console.log('target acquired, let the haunting being...')
    var add = 'git add .';
    var commit = "git commit -m 'wraith haunt test'";

    var addAndCommit = exec(add & commit, {cwd: blogDir}, function(){
      var push = exec('git push -u origin master', {cwd: blogDir}, function(error, stdout, stderr){
        if(error){
          console.log(error);
        } else {
          console.log(stdout, 'Haunting ' + gitUrl);
        }
      });
    });
  },

  //haunt -- push static site to github
  haunt : function(){
    //if folder is NOT repo
    var that = this;
    var check = exec('git rev-parse --git-dir', {cwd: blogDir}, function(error, stdout, stderr){
      console.log(stdout.match(/.git/)[0], 'testingawegagwegawegeggege');
      if(stdout.match(/.git/)){
        console.log('repo exists');
        // that.push();
      } else {
        console.log('initializing repo...');
        //remember to JSON gitUrl for production!!!!!!!!!!
        // that.hauntInit(gitUrl, that.push);
      }
    });
  }


}

