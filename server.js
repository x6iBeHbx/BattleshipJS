var path = require('path');
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = 3030; 

app.get('/', function(req, res){
    var filePath = path.join(__dirname, "index.html");
    res.sendFile(filePath);
});

app.use('/client', express.static(__dirname + '/client'));
app.use('/assets', express.static(__dirname + '/assets'));

io.on('connection', function(socket){
  console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

http.listen(port, function(){
    console.log("Running at Port " + port);
});