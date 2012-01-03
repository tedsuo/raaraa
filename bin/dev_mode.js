// ### requirements
var watch = require('nodewatch'),
    _ = require('underscore'),
    clc = require('cli-color'),
    spawn = require('child_process').spawn,
    config = require('../dev_mode_config');

// ### constants
var CWD = config.cwd || process.cwd();
var WATCH_LIST = config.watch_list;
var processes = config.processes;

// # Main
//
process.nextTick(function(){
  // initialze sub-processes
  processes.forEach(function(p){
    p.process = new SubProcess(p);
  });

  // watch codebase for changes
  WATCH_LIST.forEach(function(path){
    watch.add(__dirname+'/../'+path);
  });

  // if any file changes, restart everything
  watch.onChange(function(file,prev,curr){
      var file_path = file.slice(CWD.length+1);
      processes.forEach(function(p,i){
        processes[i].process.restart(file_path);
      });
    }
  );
  console.dev('DEV MODE watching codebase for changes');
});


// ## _class_ SubProcess
//
// spawns a restartable child process
//
function SubProcess(o){
  // initialize arguments
  this.command = o.command || error('o.command required');
  this.color = o.color || error('o.color required');
  this.name = o.name || error('o.name required');
  this.args = o.args || [];
  this.options = o.options || {};
  this.prompt = o.prompt || this.name;
  
  // child processes seem to work better when they are passed
  // process.env
  if(this.options.env){
    this.options.env = _.extend(this.options.env, process.env);
  }

  // initialize internal properties
  this.node = {};
  this.original_args = this.args.slice(0);
  this.node_count = 0;

  // start the child process unless directed not to
  if(o.on_startup !== false){
    this.start();
  }
}

// ### SubProcess: start()
// 
// spawns a child process
//
SubProcess.prototype.start =  function (){
  var name = this.name + ' ' + this.node_count;
  console.dev('DEV MODE starting ' + name);
  
  // run the command as a child process
  this.node = spawn(this.command,this.args,_.extend({},this.options));
  

  if(this.node && this.node.stdout){
    var self = this;
    this.node.stdout.on('data',function(data){
      process.stdout.write(
        clc[self.color](self.prompt+': ')+data
      );
    });
    this.node.stderr.on('data',function(data){
      process.stderr.write(
        clc[self.color](self.prompt+': ')+clc.red('ERROR ')+data
      );
    });
    this.node.on('exit',function(){
      console.dev('DEV MODE '+name+' exiting');
      console.dev(Date());
      self.node.pid = undefined;
    });
  }
};
  
// ### SubProcess: restart( file_name )
// 
// kills the process, re-issues original command, potentially with 
// new arguments.
//
SubProcess.prototype.restart = function(file_path){
  this.args = this.original_args.slice(0);

  // replace [[file_path]] token
  this.args.forEach(function(arg,i){
    this.args[i] = arg.replace(/\[\[file_path\]\]/gi,file_path);
  }.bind(this));

  if(this.node.pid){
    console.dev('DEV MODE killing '+this.name+' '+this.node_count)
    this.node.kill();
  }

  ++this.node_count;
  this.start();
};


// # Helpers
// - dev log
console.dev = function(msg){
  var c_width = 80;
  var center = function(msg) {
    var num_stars = (c_width - (msg.length + 2))/2;
    var star_str = '';
    _(num_stars).times(function() {
      star_str += '*';
    });
    var log_msg = star_str + ' ' + msg + ' ' + star_str;
    while(log_msg.length <= c_width) {
      log_msg += '*';
    }
    return log_msg;
  }

  console.log(clc.bright.green(center(msg)));
}

// - error
function error(msg){
  throw new Error(msg);
}
