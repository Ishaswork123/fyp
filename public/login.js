document.addEventListener('DOMContentLoaded', () => {
    fetch('/rooms')
        .then(response => response.json())
        .then(rooms => {
            const roomSelect = document.getElementById('room');
            rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room;
                option.innerText = room;
                roomSelect.appendChild(option);
            });
        });
});

document.getElementById('login').addEventListener('click', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    let room = document.getElementById('room').value;
    const newRoom = document.getElementById('new-room').value;

    if (newRoom) {
        room = newRoom;
    }

    if (username && room) {
        fetch('/commlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, room })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/index';
            } else {
                alert(data.message);
            }
        });
    }
});
