// script.js
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill remaining space beside toolbar
function resizeCanvas() {
  canvas.width = window.innerWidth - document.getElementById('toolbar').offsetWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Tools and controls
let drawing = false;
let currentTool = 'brush';
let brushColor = '#000000';
let brushSize = 5;

const brushBtn = document.getElementById('brush');
const eraserBtn = document.getElementById('eraser');
const colorPicker = document.getElementById('colorPicker');
const brushSizeSlider = document.getElementById('brushSize');

// Update active tool UI
function setActiveTool(tool) {
  currentTool = tool;
  brushBtn.classList.toggle('active', tool === 'brush');
  eraserBtn.classList.toggle('active', tool === 'eraser');
}

// Event handlers for tools
brushBtn.onclick = () => setActiveTool('brush');
eraserBtn.onclick = () => setActiveTool('eraser');

colorPicker.oninput = (e) => {
  brushColor = e.target.value;
}

brushSizeSlider.oninput = (e) => {
  brushSize = e.target.value;
}

// Drawing logic
function startDrawing(e) {
  drawing = true;
  draw(e); // draw immediately at click point
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath(); // reset path for smooth drawing
}

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';

  if (currentTool === 'brush') {
    ctx.strokeStyle = brushColor;
  } else if (currentTool === 'eraser') {
    ctx.strokeStyle = 'white';
  }

  // Calculate mouse position relative to canvas
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Attach mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', draw);
