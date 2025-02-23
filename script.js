// script.js
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const eraser = document.getElementById("eraser");
const socket = io();

let drawing = false;
let currentColor = "#000000";

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
});

eraser.addEventListener("click", () => {
    currentColor = "#FFFFFF";
});

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e) {
    if (!drawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    ctx.fillStyle = currentColor;
    ctx.fillRect(x, y, 5, 5);
    
    socket.emit("draw", { x, y, color: currentColor });
}

socket.on("draw", ({ x, y, color }) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 5, 5);
});
