const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let name = 0;
  console.log('a user connected');
  socket.broadcast.emit('chat message', "a user connected");
  console.log(socket.id);
  io.to(socket.id).emit('chat message', "What is your name?");
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', "user disconnected");
  });
  socket.on('chat message', (msg) => {
    if (!name) {
      name = msg;
      io.emit('chat message', `${name} joined the chat.`);
    } else {
      io.emit('chat message', `${name}: ${msg}`);
    }
  });

});



server.listen(3000, () => {
  console.log('listening on *:3000')
});
