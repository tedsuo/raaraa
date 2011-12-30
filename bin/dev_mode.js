var watch = require('nodewatch'),
    _ = require('underscore'),
    fork = require('child_process').fork,
    spawn = require('child_process').spawn;


// create the web server
var kick_server = createKickableProcess( 
  fork,
  __dirname+'/../server',
  [],
  { env: {PORT:9001} }
);

// start RaaRaa
kick_server();

// create test runner
var run_tests = createKickableProcess(
  spawn,
  'nodeunit',
  ['/test'],
  { env: _.extend({PORT:9003, NODE_ENV:'test'}, process.env) }
);

// run tests
run_tests();

// watch codebase for changes
watch
  .add('./config.js')
  .add('./images')
  .add('./lib')
  .add('./node_modules')
  .add('./raaraa')
  .add('./raaraa/lib')
  .add('./raaraa/models')
  .add('./server')
  .add('./test')
  .add('./test/lib')
  .onChange(function(file,prev,curr){
    kick_server();
    run_tests();
  }
);

console.log('DEV watching codebase for changes');



function createKickableProcess(invocation,command,args,o){
  var node = {};
  var args = args || [];
  var o = o || {};

  return function(){
    if(node.pid){
      console.warn('DEV kicking '+command)
      node.kill();
    }
    
    console.warn('DEV starting '+command);
    
    node = invocation(command,args,_.extend({},o));

    if(node && node.stdout){
      node.stdout.pipe(process.stdout);
      node.stderr.pipe(process.stdout);
    }
  }
};