console.error('*******');
console.error(process.cwd());
console.error('*******');
var watch = require('nodewatch'),
    _ = require('underscore'),
    fork = require('child_process').fork,
    spawn = require('child_process').spawn;

// ### constants

// - current working directory
var CWD = process.cwd();

// - watch list of files and directories to monitor.  Not recursive.
var WATCH_LIST = [
  'config.js',
  'images',
  'lib',
  'node_modules',
  'raaraa',
  'raaraa/lib',
  'raaraa/models',
  'server',
  'test',
  'test/lib'
];

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

// documentation generation
var write_doc = createKickableProcess( 
  fork,
  __dirname+'/../lib/docco/bin/docco'
);

// watch codebase for changes
WATCH_LIST.forEach(function(path){
  watch.add(__dirname+'/../'+path);
});

// on file change, restart everything
watch.onChange(function(file,prev,curr){
    kick_server();
    run_tests();
    var file_path = file.slice(CWD.length+1);
    console.error('*******');
    console.error(file_path);
    console.error('*******');
    write_doc(['--structured',file_path]);
  }
);

console.log('DEV watching codebase for changes');


// ## createKickableProcess(invocation,command,args,o)
//
// spawns or forks a child process, and returns a function that restarts the
// process every time you call it.
//
function createKickableProcess(invocation,command,args,o){
  var node = {};
  var args = args || [];
  var o = o || {};

  return function(new_args){
    args = new_args || args;

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