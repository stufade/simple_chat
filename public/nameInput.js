const nameInput = document.querySelector(".name-input");
const nameBtn = document.querySelector(".name-btn");
const nameSection = document.querySelector(".input-name");


nameBtn.addEventListener("click", () => {
    let name = nameInput.value;

    if (!name) return;

    socket.emit("newUser", name);

    nameSection.remove();
});