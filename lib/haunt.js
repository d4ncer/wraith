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
    var add = exec('git add .', {cwd: blogDir});
    add.stdout.on('end', function(){
      var commit = exec("git commit -m 'wraith haunt test'", {cwd: blogDir}, function(){
        var push = exec('git push -u origin master', {cwd: blogDir}, function(error, stdout, stderr){
          if(error){
            console.log(error);
          } else {
            console.log(stdout, 'Haunting ' + gitUrl);
          }
        });
      });
    })
    ;

  },

  //haunt -- push static site to github
  haunt : function(){
      this.hauntInit(gitUrl, that.push);
    });
  }


}

