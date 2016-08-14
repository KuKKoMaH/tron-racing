var http = require('http');
var express = require('express');
var peer = require('peer');

var ExpressPeerServer = peer.ExpressPeerServer;
var port = process.env.PORT || 8080;

var app = express();
var server = app.listen(port);
app.use(express.static(__dirname + '/../dist'));
app.use('/peers', ExpressPeerServer(server, {}));