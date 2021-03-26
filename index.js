const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let usersCodes = {};
let userCode = 1;

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + './public/index.html');
});

io.on('connection', (socket) => {
  console.log(`User ${userCode} connected\n`);
  usersCodes[socket.id] = new User(userCode++);
  console.log(usersCodes);
  console.log("\n")

  socket.on('chat message', (msg) => {
    socket.emit('chat message', msg, usersCodes[socket.id].color, 1);
    socket.broadcast.emit('chat message', msg, usersCodes[socket.id].color, 2);
  });

  socket.on('newUser', () => {
    console.log(`User ${usersCodes[socket.id].userId} sent a message\n`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${usersCodes[socket.id].userId} disconnected\n`);

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