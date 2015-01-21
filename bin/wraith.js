#!/usr/bin/env node
/**
 * [wraith description]
 * @type {Object}
 */

// var _ = require('underscore');

var program = require('commander');
var setup = require('./setup');
var Possess = require('./possess');
var Haunt = require('./haunt');
var Spook = require('./spook');

program
  .version(require('../package.json').version)
  .option('-d, --dir <dir>', 'specify the directory to export assets', String)
  .option('-p, --port <port>', 'specify the port [2368]')
  .option('-sp --spookPort', 'sepecify the preview port [3000]')
  .option('possess', 'grabs generated static content from local ghost server')
  .option('spook', 'runs a preview of your static site')
  .option('haunt', 'init and push static site to github')
  .option('setup', 'sets up a Wraith instance')
  .parse(process.argv);

if (program.possess) { 
  console.log('possessing...');
  var wraith = new Possess(program);
  wraith.possess();
}

if (program.spook) {
  console.log('spooking...at port: '+spookPort);
  var wraith = new Spook();
  wraith.spook();

}

if (program.haunt) {
  var wraith = new Haunt();
  wraith.haunt();

}

if (program.setup) {
  setup.setup();
}
