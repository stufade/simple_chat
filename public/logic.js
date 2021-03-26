let socket = io();
const input = document.querySelector(".input");
const messageWindow = document.querySelector(".window");

input.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        e.preventDefault();
        if (!input.value.trim()) return;
        socket.emit("newUser");
        socket.emit('chat message', input.value.trim());
        input.value = "";
    }
});

socket.on('chat message', function(msg, color, messageId) {
    let message = createMessage(msg, color, messageId);
    messageWindow.prepend(message);
});

function createMessage(msg, color, messageId) {
    let div = document.createElement("div");
    div.classList.add(`message${messageId}`);
    div.style.backgroundColor = color;
    div.textContent = msg;
    return div;
}