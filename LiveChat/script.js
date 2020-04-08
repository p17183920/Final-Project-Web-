const socket = io("http://localhost:3000"); //where our server is hosting chat application

socket.on("chat-message", data => {
    console.log(data);
})