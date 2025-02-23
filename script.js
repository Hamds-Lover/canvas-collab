// script.js
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const eraser = document.getElementById("eraser");
const socket = io();

const brushSize = document.createElement("input");
brushSize.type = "range";
brushSize.min = 1;
brushSize.max = 20;
brushSize.value = 5;
document.querySelector(".toolbar").appendChild(brushSize);

let drawing = false;
let currentColor = "#000000";
let lastX = 0, lastY = 0;

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

colorPicker.addEventListener("input", (e) => currentColor = e.target.value);
eraser.addEventListener("click", () => currentColor = "#FFFFFF");

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", (e) => startDrawing(e.touches[0]));
canvas.addEventListener("touchend", () => drawing = false);
canvas.addEventListener("touchmove", (e) => draw(e.touches[0]));

function startDrawing(e) {
    drawing = true;
    lastX = e.clientX - canvas.offsetLeft;
    lastY = e.clientY - canvas.offsetTop;
}

function draw(e) {
    if (!drawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
    socket.emit("draw", { x, y, lastX, lastY, color: currentColor, size: brushSize.value });
}

socket.on("draw", ({ x, y, lastX, lastY, color, size }) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
});

const cursorIndicator = document.createElement("div");
cursorIndicator.id = "cursorIndicator";
document.body.appendChild(cursorIndicator);

document.addEventListener("mousemove", (e) => {
    cursorIndicator.style.left = `${e.clientX}px`;
    cursorIndicator.style.top = `${e.clientY}px`;
    socket.emit("cursor", { x: e.clientX, y: e.clientY });
});

socket.on("cursor", ({ x, y }) => {
    cursorIndicator.style.left = `${x}px`;
    cursorIndicator.style.top = `${y}px`;
});
