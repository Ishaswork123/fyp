document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired!"); // Added log here

  let currentUserName = null;
  let currentRoom = null;
  let socket = null;

  let preJoinScreen = null;
  let appScreen = null;
  let joinedRoomsList = null;
  let otherRoomsList = null;
  let joinRoomBtn = null;
  let createRoomBtn = null;
  let joinUserNameInput = null;
  let joinRoomNameInput = null;
  let createUserNameInput = null;
  let createRoomNameInput = null;
  let createRoomBioInput = null;
  let notification = null;
  let roomList = null;
  let uname = null;
  let currentUserNameSpan = null;
  let joinDate = null;
  let output = null;
  let chatInput = null;
  let sendBtn = null;
  let roomBio = null;
  let roomCreator = null;
  let roomCreationDate = null;
  let emojiBtn = null;
  let emojiPicker = null;
  let logoutBtn = null;
  let feedbackDiv = null;
  let participantsDiv = null;

  if (window.location.pathname === "/") {
    preJoinScreen = document.getElementById("preJoinScreen");
    joinedRoomsList = document.getElementById("joinedRoomsList");
    otherRoomsList = document.getElementById("otherRoomsList");
    joinRoomBtn = document.getElementById("joinRoomBtn");
    createRoomBtn = document.getElementById("createRoomBtn");
    joinUserNameInput = document.getElementById("joinUserName");
    joinRoomNameInput = document.getElementById("joinRoomName");
    createUserNameInput = document.getElementById("createUserName");
    createRoomNameInput = document.getElementById("createRoomName");
    createRoomBioInput = document.getElementById("createRoomBio");
    notification = document.getElementById("notification");
  }

  if (window.location.pathname === "/screen") {
    appScreen = document.getElementById("appScreen");
    roomList = document.getElementById("room-list");
    uname = document.getElementById("Uname");
    currentUserNameSpan = document.getElementById("currentUserName");
    joinDate = document.getElementById("joinDate");
    output = document.getElementById("output");
    chatInput = document.getElementById("message-input");
    sendBtn = document.getElementById("send"); // Initialize here!
    roomBio = document.getElementById("roomBio");
    roomCreationDate = document.getElementById("roomCreationDate");
    roomCreator = document.getElementById("roomCreator");
    emojiBtn = document.getElementById("emoji-btn");
    emojiPicker = document.getElementById("emojiPicker");
    logoutBtn = document.querySelector(".logout a");
    feedbackDiv = document.getElementById("feedback");
    participantsDiv = document.getElementById("participants");

    console.log("Current username on screen page load:", currentUserName);
    console.log("Current room on screen page load:", currentRoom);
    if (currentUserName && currentRoom) {
      initSocket();
      console.log("init socket is called");
      renderApp();
    }
    console.log("render app is called");
  }

  function renderApp() {
    if (window.location.pathname === "/screen") {
      console.log("renderApp function called");
      if (uname) {
        console.log("setting user name to page header");
        uname.textContent = currentUserName;
      }
      if (currentUserNameSpan) {
        console.log("setting user name to profile section");
        currentUserNameSpan.textContent = currentUserName;
      }
      if (joinDate) {
        console.log("setting join date");
        joinDate.textContent = new Date().toLocaleDateString();
      }

      renderDashboardRooms();
      renderUserProfile();
      renderChatMessages();
      fetchParticipants();
      renderRoomInfo();

      if (logoutBtn) {
        logoutBtn.onclick = () => {
          currentUserName = null;
          currentRoom = null;
          if (socket) {
            socket.disconnect();
          }
          localStorage.removeItem("communityAppData");
          window.location.href = "/";
        };
      }
      if (sendBtn) {
        sendBtn.addEventListener("click", () => {
          if (chatInput && socket) {
            const messageText = chatInput.value.trim();
            if (messageText) {
              const message = {
                userName: currentUserName,
                roomName: currentRoom,
                text: messageText,
              };
              if (feedbackDiv) {
                feedbackDiv.textContent = "Sending...";
                feedbackDiv.style.color = "green";
              }
              socket.emit("sendMessage", message, (ack) => {
                if (feedbackDiv) {
                  if (ack.status === "ok") {
                    feedbackDiv.textContent = "Message sent";
                    setTimeout(() => {
                      feedbackDiv.textContent = "";
                    }, 2000);
                  } else {
                    feedbackDiv.textContent =
                      ack.message || "Message not sent, try again";
                    feedbackDiv.style.color = "red";
                    setTimeout(() => {
                      feedbackDiv.textContent = "";
                    }, 2000);
                  }
                }
              });
              chatInput.value = "";
            }
          }
        });
      }
      if (chatInput) {
        chatInput.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
            if (sendBtn && socket) {
              sendBtn.click();
              event.preventDefault();
            }
          }
        });
      }
    }
  }
  function fetchMessages() {
    console.log("Fetching messages for room:", currentRoom);
    fetch(`/messages/${currentRoom}`)
      .then((response) => {
        console.log("Response from /messages:", response);
        if (!response.ok) {
          throw new Error(`HTTP Error! status ${response.status}`);
        }
        return response.json();
      })
      .then((messages) => {
        console.log("Messages received:", messages);
        if (output) {
          output.innerHTML = "";
          messages.forEach((message) => {
            renderChatMessage(message);
          });
          output.scrollTop = output.scrollHeight;
        }
      })
      .catch((e) => {
        console.error("Error fetching messages:", e);
        showNotification("Error while fetching messages");
      });
  }

  function renderUserProfile() {
    console.log("render user profile called");
    if (currentUserNameSpan) {
      currentUserNameSpan.textContent = currentUserName;
    }
  }
  function fetchParticipants() {
    console.log("Fetching participants for room:", currentRoom);
    fetch(`/participants/${currentRoom}`)
      .then((response) => {
        console.log("Response from /participants:", response);
        if (!response.ok) {
          throw new Error(`HTTP Error! status ${response.status}`);
        }
        return response.json();
      })
      .then((participants) => {
        console.log("participants received:", participants);
        renderParticipants(participants);
      })
      .catch((e) => {
        console.error("error fetching participants:", e);
        showNotification("Error while fetching participants");
      });
  }
  function renderRoomInfo() {
    console.log("render room info called");
    if (roomBio && roomCreationDate && roomCreator) {
      roomBio.textContent = "";
      roomCreationDate.textContent = "";
      roomCreator.textContent = "";
      fetch("/rooms")
        .then((response) => {
          console.log("Response from /rooms:", response);
          if (!response.ok) {
            throw new Error(`HTTP Error! status ${response.status}`);
          }
          return response.json();
        })
        .then((rooms) => {
          const room = rooms.find((room) => room.roomName === currentRoom);
          if (room) {
            if (roomBio) {
              console.log("setting room bio");
              roomBio.textContent = room.bio;
            }
            if (roomCreationDate) {
              console.log("setting room creation date");
              roomCreationDate.textContent = new Date(
                room.createdAt
              ).toLocaleDateString();
            }
            if (roomCreator) {
              console.log("setting room creator");
              roomCreator.textContent = room.createdBy;
            }
          }
        })
        .catch((e) => {
          console.error("error fetching room info", e);
          showNotification("Error while fetching room info");
        });
    }
  }
  function initSocket() {
    if (!socket) {
      console.log("initializing socket");
      socket = io();
      socket.on("message", (message) => {
        console.log("message from socket", message);
        renderChatMessage(message);
      });
      socket.on("userJoined", (userName) => {
        showNotification(`User ${userName} Joined!`);
      });
      socket.on("messageRead", (messageId) => {
        markMessageAsReadUi(messageId);
      });
      socket.on("participants", (participants) => {
        console.log("participants from socket", participants);
        renderParticipants(participants);
      });
    }
  }
  // Function definitions must go before their usages

  const loadRooms = async () => {
    try {
      const response = await fetch("/rooms");
      if (!response.ok) {
        showNotification("Error while fetching rooms");
        return;
      }
      const rooms = await response.json();
      renderPreJoinRooms(rooms);
    } catch (e) {
      console.error("Error while loading rooms", e);
      showNotification("Error while fetching rooms!");
    }
  };

  const handleJoinRoom = (roomName, userName = null) => {
    if (!userName) {
      currentUserName = joinUserNameInput.value;
    } else {
      currentUserName = userName;
    }
    if (!currentUserName) {
      showNotification("Please enter your user name!");
      return;
    }
    currentRoom = roomName;
    let joinedData = localStorage.getItem("communityAppData");
    let parsedData = {
      joinedRooms: [],
    };
    if (joinedData) {
      parsedData = JSON.parse(joinedData);
      if (!parsedData.joinedRooms) {
        parsedData.joinedRooms = [];
      }
    }

    if (
      !parsedData.joinedRooms.find(
        (jr) => jr.userName === currentUserName && jr.roomName === roomName
      )
    ) {
      parsedData.joinedRooms.push({
        userName: currentUserName,
        roomName: roomName,
      });
      localStorage.setItem("communityAppData", JSON.stringify(parsedData));
    }
    initSocket();
    if (socket) {
      socket.emit("joinRoom", {
        userName: currentUserName,
        roomName: currentRoom,
      });
    }
    window.location.href = "/screen";
  };
  function renderPreJoinRooms(rooms) {
    if (joinedRoomsList) {
      joinedRoomsList.innerHTML = "";
    }
    if (otherRoomsList) {
      otherRoomsList.innerHTML = "";
    }

    const userJoinedRooms = getJoinedRooms(currentUserName);
    if (userJoinedRooms) {
      userJoinedRooms.forEach((room) => {
        const roomDetail = rooms.find((r) => r.roomName === room.roomName);
        if (roomDetail) {
          const li = document.createElement("li");
          li.textContent = `${roomDetail.roomName} (Joined)`;
          li.addEventListener("click", () =>
            handleJoinRoom(roomDetail.roomName, room.userName)
          );
          if (joinedRoomsList) {
            joinedRoomsList.appendChild(li);
          }
        }
      });
    }
    rooms.forEach((room) => {
      if (!userJoinedRooms?.find((r) => r.roomName === room.roomName)) {
        const li = document.createElement("li");
        li.textContent = room.roomName;
        li.addEventListener("click", () => handleJoinRoom(room.roomName));
        if (otherRoomsList) {
          otherRoomsList.appendChild(li);
        }
      }
    });
  }
  function getJoinedRooms(userName) {
    const data = localStorage.getItem("communityAppData");
    if (data) {
      const parsedData = JSON.parse(data);
      if (parsedData && parsedData.joinedRooms) {
        return parsedData.joinedRooms.filter((jr) => jr.userName === userName);
      }
    }
    return null;
  }
  // ... Rest of your script.js ...
  loadRooms();
  if (
    window.location.pathname === "/screen" &&
    currentRoom &&
    currentUserName
  ) {
    initSocket();
    console.log("calling render app on screen page load");
    renderApp();
    fetchMessages();
  }

  if (joinRoomBtn) {
    joinRoomBtn.addEventListener("click", () => {
      handleJoinRoom(joinRoomNameInput.value);
      joinUserNameInput.value = "";
      joinRoomNameInput.value = "";
    });
  }
  if (createRoomBtn) {
    createRoomBtn.addEventListener("click", () => {
      const roomName = createRoomNameInput.value;
      const userName = createUserNameInput.value;
      const roomBio = createRoomBioInput.value;
      if (roomName && userName && roomBio) {
        fetch("/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: roomName,
            createdBy: userName,
            bio: roomBio,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              showNotification(data.error);
            } else {
              createRoomNameInput.value = "";
              createUserNameInput.value = "";
              createRoomBioInput.value = "";
              showNotification(`Room ${roomName} created`);
              loadRooms();
            }
          })
          .catch((e) => showNotification("Error creating room!"));
      } else {
        showNotification("Please fill all the credentials!");
      }
    });
  }
  if (emojiBtn) {
    emojiBtn.addEventListener("click", (e) => {
      emojiPicker.classList.toggle("hidden");
      if (!emojiPicker.innerHTML) {
        const emojis = [
          "😀",
          "😂",
          "😊",
          "😍",
          "😎",
          "🤔",
          "😴",
          "😡",
          "💩",
          "👻",
          "❤",
          "👍",
          "🙌",
          "🎉",
          "🚀",
        ];
        emojis.forEach((emoji) => {
          const btn = document.createElement("button");
          btn.textContent = emoji;
          btn.addEventListener("click", () => {
            if (chatInput) {
              chatInput.value += emoji;
            }
            emojiPicker.classList.add("hidden");
          });
          emojiPicker.appendChild(btn);
        });
      }
      e.stopPropagation();
    });
  }
  document.addEventListener("click", (e) => {
    if (
      emojiPicker &&
      !emojiPicker.contains(e.target) &&
      !emojiBtn.contains(e.target)
    ) {
      emojiPicker.classList.add("hidden");
    }
  });
});
