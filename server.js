// var http = require('http');
// var fs = require('fs');
var path = require('path');

var express = require('express');
var app = express();

const port = 3030; 

// var server = http.createServer(function(req, res){
//     var filePath = path.join(__dirname, "index.html");
//     var fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//     //res.end();
// });

// server.listen(port, function(){
//     console.log("Server is startes, port" + port);
// });

// app.use(function (req, res, next) {
//   console.log('Time:', Date.now());
//   next();
// });
app.get('/', function(req, res){
    var filePath = path.join(__dirname, "index.html");
    res.sendFile(filePath);
});

app.get('/client/phaser.min.js', function(req, res){
    var fps = path.join(__dirname, "client/phaser.min.js");
    res.sendFile(fps);
});

app.get('/client/client.js', function(req, res){
    var fp = path.join(__dirname, "client/client.js");
    res.sendFile(fp);
});

app.get('/assets/area.png', function(req, res){
    var f = path.join(__dirname, "assets/area.png");
    res.sendFile(f);
});

app.get('/assets/miss.png', function(req, res){
    var miss = path.join(__dirname, "assets/miss.png");
    res.sendFile(miss);
});

app.get('/assets/ship4.png', function(req, res){
    var ship4img = path.join(__dirname, "assets/ship4.png");
    res.sendFile(ship4img);
});

app.get('/assets/ship3.png', function(req, res){
    var ship3img = path.join(__dirname, "assets/ship3.png");
    res.sendFile(ship3img);
});

app.listen(port, function(){
    console.log("Running at Port " + port);
});