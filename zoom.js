const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let scaleFactor = 1.0;
const zoomSensitivity = 0.1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX;
let startY;

function zoom(event) {
  event.preventDefault();
  const zoomPointX = event.offsetX; // Mouse X relative to canvas
  const zoomPointY = event.offsetY; // Mouse Y relative to canvas

  const oldScale = scaleFactor;
  scaleFactor += event.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
  scaleFactor = Math.max(0.5, Math.min(3, scaleFactor));
  const newScale = scaleFactor;

  // Adjust offset to zoom around the mouse cursor
  offsetX = (offsetX - zoomPointX) * newScale / oldScale + zoomPointX;
  offsetY = (offsetY - zoomPointY) * newScale / oldScale + zoomPointY;

  applyTransform();
  redrawCanvas();
}

function startPan(event) {
  isDragging = true;
  startX = event.clientX - offsetX;
  startY = event.clientY - offsetY;
}

function pan(event) {
  if (!isDragging) return;
  offsetX = event.clientX - startX;
  offsetY = event.clientY - startY;
  applyTransform();
  redrawCanvas();
}

function endPan() {
  isDragging = false;
}

function applyTransform() {
  ctx.setTransform(scaleFactor, 0, 0, scaleFactor, offsetX, offsetY);
}

canvas.addEventListener('wheel', zoom);
canvas.addEventListener('mousedown', startPan);
canvas.addEventListener('mousemove', pan);
canvas.addEventListener('mouseup', endPan);
canvas.addEventListener('mouseout', endPan); // In case mouse leaves during drag

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ... your drawing commands using the scaled and translated context ...
}

// Initial setup
applyTransform();
redrawCanvas();