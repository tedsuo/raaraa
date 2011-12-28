var express = require('express');

var LOG_FORMAT = ':method :url :status :res[content-length] - :response-time ms'

// middleware stacks
module.exports = {
  
  standard: [
    express.logger(LOG_FORMAT),
    express.cookieParser(),
    express.session({secret: 'this is fake'}),
    express.bodyParser()
  ],

  streaming: [
    express.logger(LOG_FORMAT)
  ]

};