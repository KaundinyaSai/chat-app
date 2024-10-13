//init function
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "./auth/login.html";

  console.log("User logged in", token);

  const payload = jwt_decode(token);
  const expiresIn = payload.exp * 1000;
  const timeToExpire = new Date(expiresIn);

  console.log(`Token expires in ${timeToExpire}`);

  if (Date.now() >= expiresIn) {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  }

  getMessagesOnLoad(payload.id);
});

async function getMessagesOnLoad(userId) {
  const ul = document.getElementById("messageList");
  ul.innerHTML = "";

  try {
    const response = await axios.get("http://localhost:4001/api/messages");

    if (response.status === 200) {
      const messages = response.data;

      messages.forEach((message) => {
        if (message.senderId == userId) {
          const messageTemplate = document.getElementById(
            "userMessageTemplate"
          );
          const ul = document.getElementById("messageList");
          const newMsg = messageTemplate.content.cloneNode(true);

          newMsg.querySelector(".messageText").textContent = message.content;
          ul.appendChild(newMsg);
          ul.scrollTop = ul.scrollHeight;
        } else {
          const messageTemplate = document.getElementById(
            "otherMessageTemplate"
          );
          const ul = document.getElementById("messageList");
          const newMsg = messageTemplate.content.cloneNode(true);

          newMsg.querySelector(".messageText").textContent = message.content;
          newMsg.querySelector(".username").textContent = message.User.username;
          ul.appendChild(newMsg);
          ul.scrollTop = ul.scrollHeight;
        }
      });
    } else {
      console.log("Server error:", response.status);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

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

  const token = localStorage.getItem("token");

  const payload = jwt_decode(token);
  const expiresIn = payload.exp * 1000;
  const id = payload.id;

  if (Date.now() >= expiresIn) {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
    return;
  }

  isSender = true;
  addUserMessage(message.value, id);
  socket.emit("sendMessage", token, message.value);

  message.value = "";
});

async function addUserMessage(message, senderId) {
  const messageTemplate = document.getElementById("userMessageTemplate");
  const ul = document.getElementById("messageList");
  const newMsg = messageTemplate.content.cloneNode(true);

  newMsg.querySelector(".messageText").textContent = message;
  ul.appendChild(newMsg);
  ul.scrollTop = ul.scrollHeight;

  try {
    const response = await axios.post("http://localhost:4001/api/messages", {
      content: message,
      senderId,
    });

    if (response.status === 201) {
      console.log("Message sent successfully");
    } else {
      console.log("Error sending message:", response.data.message);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

function addOtherMessage(username, message) {
  const messageTemplate = document.getElementById("otherMessageTemplate");
  const ul = document.getElementById("messageList");
  const newMsg = messageTemplate.content.cloneNode(true);

  newMsg.querySelector(".messageText").textContent = message;
  newMsg.querySelector(".username").textContent = username;
  ul.appendChild(newMsg);
  ul.scrollTop = ul.scrollHeight;
}

socket.on("sendMessage", (data) => {
  const { username, message } = data;

  if (!isSender) {
    addOtherMessage(username, message);
  }
  isSender = false;
});
