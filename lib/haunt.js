var git = require('github-api');
var exec = require('child_process').exec;

//variables:
//gitUrl = githuburl
//

var hauntInit = function(gitUrl){
    //git init
    //git remote add origin json.url
    var init = exec('git init');
    init.stdout.on('end', function(){
      var addOrigin = exec('get add origin '+ gitUrl);
      addOrigin.stdout.on('end', function(){
        console.log('git initialized, origin set to: ' + gitUrl);
      })
    })
}

//haunt -- push static site to github
var haunt = function(){
  //if folder is NOT repo
  var check = exec('gir rev-parse --git-dir', function(error, stdout, stderr){
    if(stdout !== '.git'){
      hauntInit(json.gitUrl);
    }
  })
  //hauntGit(json);
  //git push origin master
}

var push =function(callback){
  var push = exec('git push origin master', function(error, stdout, stderr){
    if(error){
      console.throw(error);
    } else {
      console.log(stdout);
    }
  })
}