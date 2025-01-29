const socket = io("http://localhost:3000");

// DOM Elements
const sendButton = document.getElementById("send");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("chat-list");

// User and room details
const userName = "Anonymous"; // Replace with dynamic username if needed
const roomName = "general"; // Replace with dynamic room name if needed

// Join the room
socket.emit("joinRoom", { userName, roomName });

// Event to send a message on "Enter" key press
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Event to send a message on clicking the "Send" button
sendButton.addEventListener("click", () => {
  sendMessage();
});

// Function to send a message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit(
      "sendMessage",
      { userName, roomName, text: message },
      (response) => {
        if (response.status === "ok") {
          console.log("Message sent successfully!");
        } else {
          console.error("Error sending message:", response.message);
        }
      }
    );
    messageInput.value = ""; // Clear the input field
  }
}

// Listen for previous messages (fetched from the database)
socket.on("loadMessages", (messages) => {
  messages.forEach((message) => addMessageToUI(message));
});

// Listen for new messages
socket.on("message", (data) => {
  addMessageToUI(data);
});

// Function to add a message to the UI
function addMessageToUI(message) {
  const messageElem = document.createElement("div");
  messageElem.classList.add("chat-box");
  messageElem.textContent = `${message.text}`;
  messagesDiv.appendChild(messageElem);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the latest message
}

/////////////

// const socket = io("http://localhost:3000");

// // Join a room (example)
// const userName = "Anonymous";
// const roomName = "general";
// console.log(userName, roomName);
// socket.emit("joinRoom", { userName, roomName });

// // Send a message
// const sendButton = document.getElementById("send");
// const messageInput = document.getElementById("message-input");

// document.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     const message = messageInput.value.trim();
//     if (message) {
//       socket.emit(
//         "sendMessage",
//         { userName, roomName, text: message },
//         (response) => {
//           if (response.status === "ok") {
//             console.log("Message sent successfully!");
//           } else {
//             console.error("Error sending message:", response.message);
//           }
//         }
//       );
//       messageInput.value = ""; // Clear input field
//     }
//   }
// });

// // Receive messages
// socket.on("message", (data) => {
//   const messagesDiv = document.getElementById("chat-list");
//   const messageElem = document.createElement("div");
//   messageElem.classList.add("chat-box");
//   messageElem.textContent = `${data.text}`;
//   messagesDiv.appendChild(messageElem);
// });
