const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // Serve frontend files from 'public' folder

let drawingData = []; // Store drawing history

io.on("connection", (socket) => {
    console.log("A user connected");

    // Send existing drawing data to new users
    socket.emit("loadCanvas", drawingData);

    socket.on("draw", (data) => {
        drawingData.push(data); // Store the stroke
        socket.broadcast.emit("draw", data);
    });

    socket.on("cursor", (data) => {
        socket.broadcast.emit("cursor", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
