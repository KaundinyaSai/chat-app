//init function
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "./auth/login.html";

  const payload = jwt_decode(token);
  const expiresIn = payload.exp * 1000;
  const timeToExpire = new Date(expiresIn);

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

//typing indicators
const input = document.getElementById("messageInput");
const sideBar = document.getElementById("sideBar");
let typingTimeouts = {}; // To store timeouts for each user

// Handle user input for typing event
input.addEventListener("input", () => {
  const token = localStorage.getItem("token");
  socket.emit("typing", token);
});

socket.on("typing", (data) => {
  const { username } = data;

  // Check if an indicator for this user already exists
  let existingIndicator = document.getElementById(`${username}-typing`);

  if (existingIndicator) {
    existingIndicator.textContent = `${username} is typing...`;
  } else {
    const newTypingIndicator = document.createElement("h2");
    newTypingIndicator.textContent = `${username} is typing...`;
    newTypingIndicator.id = `${username}-typing`; // Unique ID for this user's typing indicator
    newTypingIndicator.style.textAlign = "center";
    sideBar.appendChild(newTypingIndicator);
  }

  // Clear previous timeout for this user
  clearTimeout(typingTimeouts[username]);

  // Set a timeout to clear the typing indicator after 3 seconds of inactivity
  typingTimeouts[username] = setTimeout(() => {
    const userIndicator = document.getElementById(`${username}-typing`);
    if (userIndicator) {
      sideBar.removeChild(userIndicator);
    }
    delete typingTimeouts[username]; // Clean up the timeout record
  }, 3000);
});

// Clear the indicator when "Enter" is pressed
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const token = localStorage.getItem("token");
    socket.emit("stopTyping", token); // Optionally emit stopTyping event to notify others

    // Clear the local user's typing indicator immediately
    clearUserTypingIndicator();
  }
});

// function to clear the current user's typing indicator
function clearUserTypingIndicator() {
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);
  const username = decoded.username;

  const userIndicator = document.getElementById(`${username}-typing`);
  if (userIndicator) {
    sideBar.removeChild(userIndicator);
  }

  clearTimeout(typingTimeouts[username]); // Clear timeout for current user
  delete typingTimeouts[username]; // Clean up the timeout record
}
