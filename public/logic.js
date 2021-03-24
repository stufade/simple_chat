var socket = io();
const input = document.querySelector(".input");
const messageWindow = document.querySelector(".window");
let userCode = 2;
input.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        e.preventDefault();
        if (!input.value.trim()) return;
        socket.emit('chat message', input.value.trim());
        input.value = "";
    }
});
socket.on('chat message', function(msg) {
    let message = createMessage(msg);
    messageWindow.prepend(message);
});
function createMessage(msg) {
    let div = document.createElement("div");
    div.classList.add(`message${userCode++%2 + 1}`);
    div.textContent = msg;
    return div;
}