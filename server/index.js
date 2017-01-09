var http = require('http');
var express = require('express');
var peer = require('peer');


var ExpressPeerServer = peer.ExpressPeerServer;
var port = process.env.PORT || 8080;

var app = express();
var server = app.listen(port);
app.use(express.static(__dirname + '/../dist'));
app.use('/peers', ExpressPeerServer(server, { allow_discovery: true }));

if (process.env.NODE_ENV != 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require(__dirname + '/../webpack.config.js');
  var compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}
