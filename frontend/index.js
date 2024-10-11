const socket = io();
let isSender = false;

socket.on("connect", () => {
  console.log("Connected");
});

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = document.getElementById("messageInput");
  if (message.value === "") return;

  isSender = true;
  addUserMessage(message.value);
  socket.emit("sendMessage", message.value);

  message.value = "";
});

function addUserMessage(message) {
  const messageTemplate = document.getElementById("userMessageTemplate");
  const ul = document.getElementById("messageList");
  const newMsg = messageTemplate.content.cloneNode(true);

  newMsg.querySelector(".messageText").textContent = message;
  ul.appendChild(newMsg);
  ul.scrollTop = ul.scrollHeight;
}

function addOtherMessage(message) {
  const messageTemplate = document.getElementById("otherMessageTemplate");
  const ul = document.getElementById("messageList");
  const newMsg = messageTemplate.content.cloneNode(true);

  newMsg.querySelector(".messageText").textContent = message;
  ul.appendChild(newMsg);
  ul.scrollTop = ul.scrollHeight;
}

socket.on("sendMessage", (message) => {
  if (!isSender) {
    addOtherMessage(message);
  }
  isSender = false;
});
