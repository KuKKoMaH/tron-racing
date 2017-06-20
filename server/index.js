const http = require('http');
const express = require('express');
const peer = require('peer');
const io = require('socket.io');

const ExpressPeerServer = peer.ExpressPeerServer;
const port = process.env.PORT || 5000;

const app = express();
const server = app.listen(port);
app.use(express.static(__dirname + '/../dist'));
app.use('/peers', ExpressPeerServer(server, { allow_discovery: true }));
const socket = io(server);

if (process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require(__dirname + '/../webpack.config.js');
  var compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}
