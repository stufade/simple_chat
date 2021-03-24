var socket = io();
const input = document.querySelector(".input");
const messageWindow = document.querySelector(".window");
let userCode = 2;
input.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        e.preventDefault();
        if (!input.value.trim()) return;
        socket.emit("newUser", socket.id);
        socket.emit('chat message', input.value.trim(), socket.id);
        input.value = "";
    }
});
socket.on('chat message', function(msg, id) {
    let message = createMessage(msg, id);
    messageWindow.prepend(message);
});
function createMessage(msg, id) {
    let div = document.createElement("div");
    div.classList.add(`message${id}`);
    div.textContent = msg;
    return div;
}