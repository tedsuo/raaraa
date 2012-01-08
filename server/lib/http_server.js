// # Express HttpServer extensions
//
// ## new methods
//
// ### onReady(cb) 
// callback called on nextTick if server is already listening, added to future
// *listening* events
// 
// ### onReadyOnce(cb) 
// callback called on nextTick if server is already listening, otherwise added 
// to run once on next *listening* event
//
var Express = require('express'),
    util = require('util');

// ## HttpServer
//
var HttpServer = exports.HttpServer = function(){
  this.listening = false;

  Express.HTTPServer.apply(this,arguments);
  
  this.on('listening',function(){
    this.listening = true;
  });
  this.on('close',function(){
    this.listening = false;
  });
};

util.inherits(HttpServer, Express.HTTPServer);

HttpServer.prototype.onReady = function(cb){
  if(this.listening){
    process.nextTick(cb);
  }
  this.on('listening',cb);
}

HttpServer.prototype.onReadyOnce = function(cb){
  if(this.listening){
    process.nextTick(cb);
  } else {
    this.once('listening',cb);
  }
}

// ## HttpsServer
//
var HttpsServer = exports.HttpsServer = function(){
  this.listening = false;

  Express.HTTPSServer.call(this,arguments);
  
  this.on('listening',function(){
    this.listening = true;
  });
  this.on('close',function(){
    this.listening = false;
  });
};

util.inherits(HttpsServer, Express.HTTPSServer);

HttpsServer.prototype.onReady = function(cb){
  if(this.listening){
    process.nextTick(cb);
  }
  this.on('listening',cb);
}

HttpsServer.prototype.onReadyOnce = function(cb){
  if(this.listening){
    process.nextTick(cb);
  } else {
    this.once('listening',cb);
  }
}