const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Serve assets from Frontend folder to root of url
app.use(express.static('../Frontend'))

// Set up Socket IO 
io.on('connection', function(socket){
  ID = socket.id;
  console.log('client id - '+ socket.id);   

  // When socket is disconnected
  socket.on('disconnect', function () {
     console.log('A user disconnected', ID);
     socket.broadcast.emit("user disconnected", ID);
  });

  socket.on('mouse position', (mousePosition) => {
    const mousePositionObject = {id: ID, x: mousePosition.x, y: mousePosition.y};
    socket.broadcast.emit("other mouse position", mousePositionObject)
  });

  socket.on('mouse down', function ({x,y,mouseEmojiStr}) {
    console.log("down");
    socket.broadcast.emit("other mouse down", {id: ID, x: x, y: y, newEmojiStr: mouseEmojiStr, })
  });

  socket.on('mouse up', function () {
    socket.broadcast.emit("other mouse up", ID)
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});