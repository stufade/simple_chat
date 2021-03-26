const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let usersCodes = {}; // socket.id -> {color, userId}
let usersIds = {};   // userId -> socket.id
let userCode = 1;

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + './public/index.html');
});

io.on('connection', (socket) => {
  console.log(`User ${userCode} connected\n`);
  usersCodes[socket.id] = new User(userCode);
  usersIds[userCode] = socket.id;
  io.emit("chat message", `User ${userCode} connected`, usersCodes[socket.id].color, 0);
  console.log(usersCodes);
  console.log("\n");
  userCode++;

  socket.on('private message', (recipient, msg) => {
    io.to(usersIds[recipient]).emit('chat message', msg, usersCodes[socket.id].color, 2, "private");
    socket.emit('chat message', msg, usersCodes[socket.id].color, 1, "private");
  });

  socket.on('chat message', (msg) => {
    socket.emit('chat message', msg, usersCodes[socket.id].color, 1);
    socket.broadcast.emit('chat message', msg, usersCodes[socket.id].color, 2);
  });

  socket.on('newMessage', () => {
    console.log(`User ${usersCodes[socket.id].userId} sent a message\n`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${usersCodes[socket.id].userId} disconnected\n`);
    io.emit("chat message", `User ${usersCodes[socket.id].userId} disconnected`, usersCodes[socket.id].color, 0);

    delete usersCodes[socket.id];

    console.log(usersCodes);
  })

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

class User {
  userId;
  color;

  constructor(userId) {
    function randomColor() {
      let c = '';
  
      while (c.length < 6) {
          c += (Math.random()).toString(16).substr(-6).substr(-1);
      }
  
      return '#' + c;
    }

    let clr = randomColor();
    
    this.userId = userId;
    this.color = clr;
  }
}