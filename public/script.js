document.addEventListener('DOMContentLoaded', () => {
    let username = localStorage.getItem('username');
    let room = localStorage.getItem('room');
    const socket = io();
  
    // DOM elements
    const roomList = document.getElementById('room-list');
    const messageInput = document.querySelector('#message input');
    const sendButton = document.getElementById('send');
    const feedback = document.getElementById('feedback');
    const participants = document.getElementById('participants');
    const communityName = document.getElementById('title');
    const Name = document.getElementById('Uname');
    const output = document.getElementById('output');
  
    Name.innerText = username;
    communityName.innerText = room;
  
    // Fetch the rooms from the server
    fetchRooms();
  
    // Function to fetch rooms
    function fetchRooms() {
      fetch('/rooms')
        .then(response => response.json())
        .then(rooms => {
          roomList.innerHTML = '';
          rooms.forEach(roomName => {
            roomList.innerHTML += `
              <li><a href="#" onclick="switchRoom('${roomName}')"><i class="fa fa-circle-o offline"></i><span>${roomName}</span></a></li>
            `;
          });
        })
        .catch(error => console.error('Error fetching rooms:', error));
    }
  
    // Switch room function
    window.switchRoom = (newRoom) => {
      room = newRoom;
      localStorage.setItem('room', newRoom);
      communityName.innerText = newRoom;
      output.innerHTML = '';
      socket.emit('join', { username, room });
    };
  
    socket.emit('join', { username, room });
  
    // Load previous messages
    socket.on('previous messages', (messages) => {
      messages.forEach(msg => {
        appendMessage(msg);
      });
    });
  
    // Function to append message
    function appendMessage(data) {
      const messageTime = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      output.innerHTML += `
        <li class="me">
          <div class="name">
            <span>${data.username}</span>
          </div>
          <div class="message">
            <p>${data.message}</p>
            <span class="msg-time">${messageTime}</span>
          </div>
        </li>
      `;
      output.scrollTop = output.scrollHeight;
    }
  
    // Send message function
    function sendMessage() {
      const message = messageInput.value;
      if (message) {
        socket.emit('chat message', { username, room, message });
        messageInput.value = '';
      }
    }
  
    // Send message on button click or Enter key
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
      }
    });
  
    messageInput.addEventListener('keypress', () => {
      socket.emit('typing', { username, room });
    });
  
    socket.on('chat message', (data) => {
      feedback.innerHTML = '';
      appendMessage(data);
    });
  
    socket.on('typing', (data) => {
      feedback.innerHTML = `<p><em>${data.username} is typing...</em></p>`;
    });
  
    socket.on('user joined', (data) => {
      output.innerHTML += `<p><em>${data.username} has joined the chat</em></p>`;
      updateParticipants(data.participants); // Ensure the participants are updated
    });
    
    socket.on('user left', (data) => {
      output.innerHTML += `<p><em>${data.username} has left the chat</em></p>`;
      updateParticipants(data.participants); // Ensure the participants are updated
    });
    
    socket.on('participants', (data) => {
      updateParticipants(data); // Update participant list when received from the server
    });
    
    function updateParticipants(users) {
      participants.innerHTML = '';
      users.forEach(user => {
        participants.innerHTML += `<p>${user}</p>`;
      });
    }
    
  });