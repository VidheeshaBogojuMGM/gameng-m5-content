var express = require('express'),
    util = require('util'),
    config = require('config');

var app = express();

require('./config/express')(app, config);

var server = app.listen(config.port);

console.log('express server listening on port: ' + config.port);

module.exports = app;
