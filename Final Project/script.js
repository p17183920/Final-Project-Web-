var socket = io("http://localhost:3000"); //where server is hosting chat application

socket.on("chat-message", data => {
    console.log(data);
})