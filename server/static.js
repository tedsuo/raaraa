var express = require('express');
var filed = require('filed');
var rr = require('../raaraa');

// Static file server
exports.setup = function(app) {
  serveDirectory(app,[
    {
      url: '/client',
      dir: __dirname+'/client/'
    },
    {
      url: '/templates',
      dir: __dirname+'/../templates/'
    },
    {
      url: '/stylesheets',
      dir: __dirname+'/../stylesheets/'
    },
    {
      url: '/images',
      dir: __dirname+'/../images/'
    },
    {
      url: '/lib',
      dir: __dirname+'/../lib/'
    },
    {
      url: '/raaraa',
      dir: rr.lib_dirname
    }
  ]);
};

function serveDirectory( app, static_dirs){
  static_dirs.forEach(function(static_dir){
    app.get( static_dir.url+'/*', function(req,res){
      filed(static_dir.dir+req.params[0]).pipe(res);
    });    
  });
}