const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const parentDirectory = __dirname.split("\\").slice(0, -1).join("\\");

const User = require("./User.js");

let usersCodes = {}; // socket.id -> {color, sameUserNameId, userName}
let usersNames = {}; // userName -> socket.id


app.use(express.static(parentDirectory + "/public"));

app.get('/', (req, res) => {
  res.sendFile(parentDirectory + '/public/index.html');
});

io.on('connection', (socket) => {

  socket.on("newUser", userName => {
    if (usersNames.hasOwnProperty(userName)) {
      userName += "#" + usersCodes[usersNames[userName]].sameUserNameId++;
    }
    console.log(`${userName} connected\n`);
    usersCodes[socket.id] = new User(userName);
    console.log(usersCodes);
    console.log("\n");

    usersNames[userName] = socket.id;
    io.emit("chat message", `${userName} connected`, usersCodes[socket.id].color, 0);
  });

  socket.on('private message', (recipient, msg) => {
    if (!usersCodes[socket.id]) return;

    io.to(usersNames[recipient]).emit('chat message', msg, usersCodes[socket.id].color, 2, "private");
    socket.emit('chat message', msg, usersCodes[socket.id].color, 1, "private");
  });

  socket.on('chat message', (msg) => {
    if (!usersCodes[socket.id]) return;
    
    socket.emit('chat message', msg, usersCodes[socket.id].color, 1);
    socket.broadcast.emit('chat message', msg, usersCodes[socket.id].color, 2);
  });

  socket.on('newMessage', () => {
    if (!usersCodes[socket.id]) return;

    console.log(`User ${usersCodes[socket.id].userId} sent a message\n`);
  });

  socket.on("disconnect", () => {
    if (!usersCodes[socket.id]) return;

    console.log(`${usersCodes[socket.id].userName} disconnected\n`);
    io.emit("chat message", `${usersCodes[socket.id].userName} disconnected`, usersCodes[socket.id].color, 0);

    delete usersNames[usersCodes[socket.id].userName];
    delete usersCodes[socket.id];

    console.log(usersCodes);
  })

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});