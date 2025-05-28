// script.js

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const toolbar = document.getElementById('toolbar');

function resizeCanvas() {
  canvas.width = window.innerWidth - toolbar.offsetWidth;
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
const fillBtn = document.getElementById('fill');
const rectBtn = document.getElementById('rect');
const circleBtn = document.getElementById('circle');

const colorPicker = document.getElementById('colorPicker');
const brushSizeSlider = document.getElementById('brushSize');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const saveBtn = document.getElementById('save');

// Undo/Redo stack
let undoStack = [];
let redoStack = [];
const maxUndo = 50;

// Save current canvas state to undo stack
function saveState() {
  if (undoStack.length >= maxUndo) {
    undoStack.shift();
  }
  undoStack.push(canvas.toDataURL());
  redoStack = []; // clear redo on new action
  updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;
}

// Restore canvas from dataURL
function restoreState(dataURL) {
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

// Set active tool UI
function setActiveTool(tool) {
  currentTool = tool;
  [brushBtn, eraserBtn, fillBtn, rectBtn, circleBtn].forEach(btn => {
    btn.classList.toggle('active', btn.id === tool);
  });
}

brushBtn.onclick = () => setActiveTool('brush');
eraserBtn.onclick = () => setActiveTool('eraser');
fillBtn.onclick = () => setActiveTool('fill');
rectBtn.onclick = () => setActiveTool('rect');
circleBtn.onclick = () => setActiveTool('circle');

colorPicker.oninput = e => brushColor = e.target.value;
brushSizeSlider.oninput = e => brushSize = e.target.value;

undoBtn.onclick = () => {
  if (undoStack.length === 0) return;
  redoStack.push(canvas.toDataURL());
  const dataURL = undoStack.pop();
  restoreState(dataURL);
  updateUndoRedoButtons();
}

redoBtn.onclick = () => {
  if (redoStack.length === 0) return;
  undoStack.push(canvas.toDataURL());
  const dataURL = redoStack.pop();
  restoreState(dataURL);
  updateUndoRedoButtons();
}

saveBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Drawing variables
let startX = 0;
let startY = 0;

// Fill tool implementation (bucket fill)
// Uses a flood fill algorithm on canvas pixel data
function floodFill(x, y, fillColor) {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const width = imgData.width;
  const height = imgData.height;

  const targetPos = (y * width + x) * 4;
  const targetColor = data.slice(targetPos, targetPos + 4);
  const fillColorArr = hexToRgba(fillColor);

  // If target color same as fill color, no fill needed
  if (colorsMatch(targetColor, fillColorArr)) return;

  const stack = [[x, y]];

  while (stack.length) {
    const [nx, ny] = stack.pop();
    const pos = (ny * width + nx) * 4;
    const currentColor = data.slice(pos, pos + 4);

    if (colorsMatch(currentColor, targetColor)) {
      data[pos] = fillColorArr[0];
      data[pos + 1] = fillColorArr[1];
      data[pos + 2] = fillColorArr[2];
      data[pos + 3] = fillColorArr[3];

      if (nx > 0) stack.push([nx - 1, ny]);
      if (nx < width - 1) stack.push([nx + 1, ny]);
      if (ny > 0) stack.push([nx, ny - 1]);
      if (ny < height - 1) stack.push([nx, ny + 1]);
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function hexToRgba(hex) {
  let c = hex.substring(1);
  if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
  const bigint = parseInt(c, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
}

function colorsMatch(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

// Drawing logic
function startDrawing(e) {
  e.preventDefault();
  drawing = true;
  const { x, y } = getPointerPos(e);
  startX = x;
  startY = y;

  if (currentTool === 'fill') {
    saveState();
    floodFill(Math.floor(x), Math.floor(y), brushColor);
    drawing = false;
  } else if (currentTool === 'brush' || currentTool === 'eraser') {
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
}

function stopDrawing(e) {
  if (!drawing) return;
  drawing = false;

  if (currentTool === 'rect') {
    const { x, y } = getPointerPos(e);
    saveState();
    drawRect(startX, startY, x, y);
  } else if (currentTool === 'circle') {
    const { x, y } = getPointerPos(e);
    saveState();
    drawCircle(startX, startY, x, y);
  } else if (currentTool === 'brush' || currentTool === 'eraser') {
    saveState();
    ctx.beginPath();
  }
}

function draw(e) {
  e.preventDefault();
  if (!drawing) return;
  const { x, y } = getPointerPos(e);

  if (currentTool === 'brush' || currentTool === 'eraser') {
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentTool === 'brush' ? brushColor : 'white';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else if (currentTool === 'rect' || currentTool === 'circle') {
    // For shapes: show preview by redrawing canvas and drawing shape on top
    // We'll do this with an overlay technique:
    restoreState(undoStack[undoStack.length - 1] || canvas.toDataURL());
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;
    ctx.setLineDash([6]); // dashed preview line

    const width = x - startX;
    const height = y - startY;

    if (currentTool === 'rect') {
      ctx.strokeRect(startX, startY, width, height);
    } else if (currentTool === 'circle') {
      ctx.beginPath();
      const radius = Math.sqrt(width * width + height * height);
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }
}

// Shape finalizers
function drawRect(x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = brushColor;
  ctx.strokeRect(x1, y1, width, height);
}

function drawCircle(x1, y1, x2, y2) {
  const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = brushColor;
  ctx.beginPath();
  ctx.arc(x1, y1, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Get mouse or touch pointer position relative to canvas
function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  let clientX, clientY;

  if (e.touches) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

// Attach mouse and touch events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);
canvas.addEventListener('touchmove', draw);

// Initialize
setActiveTool('brush');
saveState();
updateUndoRedoButtons();
