let socket = io();
const input = document.querySelector(".input");
const messageWindow = document.querySelector(".window");

input.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        let text = input.value.trim();
        e.preventDefault();
        if (!text) return;

        let words = text.split(" ");
        if (words[0] == "/w" && words[1]) {
            let firstIndex = text.indexOf(`"`) + 1,
                lastIndex  = text.indexOf(`"`, firstIndex + 1);
            let recipientName = text.slice(firstIndex, lastIndex);
            console.log(recipientName);
            socket.emit("private message", recipientName, text.slice(lastIndex + 2, -1));
            input.value = "";
            return;
        }

        socket.emit("newMessage");
        socket.emit('chat message', text);
        input.value = "";
    }
});

socket.on('chat message', function(msg, color, messageId, additionalClasses = "") {
    let message = createMessage(msg, color, messageId, additionalClasses);
    messageWindow.prepend(message);
});

function createMessage(msg, color, messageId, additionalClasses) {
    let div = document.createElement("div");
    div.classList.add(`message${messageId}`);
    if (additionalClasses) {
        div.classList.add(additionalClasses);
    }
    if (messageId === 0) {
        div.style.color = color;
    } else {
        div.style.backgroundColor = color;
    }
    div.textContent = msg;
    return div;
}