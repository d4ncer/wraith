var exec = require('child_process').exec;
var path = require('path');

//variables:
//using temp gitUrl to test
var gitUrl = 'https://github.com/minocys/tester.git';
var blogDir = path.resolve(process.cwd(), './static');


module.exports = {
  //haunt -- push static site to github
  haunt : function(){
    //if folder is NOT repo
    var check = exec('git rev-parse --git-dir', {cwd: blogDir}, function(error, stdout, stderr){
      if(stdout !== '.git'){
        //remember to JSON gitUrl for production!!!!!!!!!!
        hauntInit(gitUrl, push);
      } else {
        push();
      }
    });
  },

  hauntInit : function(gitUrl, callback){
    //git init
    //git remote add origin json.url
    var init = exec('git init', {cwd: blogDir});
    init.stdout.on('end', function(){
      var addOrigin = exec('get remote add origin '+ gitUrl, {cwd: blogDir});
      addOrigin.stdout.on('end', function(){
        console.log('git initialized, origin set to: ' + gitUrl);
        if(callback){
          callback();
        }
      });
    });
  },

  push : function(){
    var commit = exec('git commit -m "wraith haunt test"', {cwd: blogDir});
    commit.stdout.on('end', function(){
      var push = exec('git push -u origin master', {cwd: blogDir}, function(error, stdout, stderr){
        if(error){
          console.throw(error);
        } else {
          console.log(stdout);
        }
      });
    });
  }

}

