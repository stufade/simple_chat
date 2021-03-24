const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var usersCodes = {};
var userCode = 1;

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + './public/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg, id) => {
    io.emit('chat message', msg, usersCodes[id]);
  });
  socket.on('newUser', msg => {
    if (!usersCodes[msg]) usersCodes[msg] = userCode++;
    console.log(usersCodes[msg]);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});