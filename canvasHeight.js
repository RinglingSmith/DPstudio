// Get canvas elements
const paintCanvas = document.getElementById('paintCanvas');
const ctx = paintCanvas.getContext('2d');

// Get controls
const canvasWidthInput = document.getElementById('canvasWidth');
const canvasHeightInput = document.getElementById('canvasHeight');
const resizeCanvasBtn = document.getElementById('resizeCanvasBtn');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const brushType = document.getElementById('brushType');
const clearBtn = document.getElementById('clearBtn');
const savePngBtn = document.getElementById('savePngBtn');
const saveJpgBtn = document.getElementById('saveJpgBtn');

// Initialize painting variables
let painting = false;
let brushColor = colorPicker.value;
let brushWidth = brushSize.value;

// Paint function
function getMousePos(evt) {
  const rect = paintCanvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function startPaint(evt) {
  painting = true;
  const pos = getMousePos(evt);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function endPaint() {
  painting = false;
  ctx.closePath();
}

function draw(evt) {
  if (!painting) return;
  const pos = getMousePos(evt);
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushWidth;
  ctx.lineCap = 'round';

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// Event listeners for drawing
paintCanvas.addEventListener('mousedown', startPaint);
paintCanvas.addEventListener('mouseup', endPaint);
paintCanvas.addEventListener('mouseout', endPaint);
paintCanvas.addEventListener('mousemove', draw);

// Resize Canvas
resizeCanvasBtn.addEventListener('click', () => {
  const newWidth = parseInt(canvasWidthInput.value);
  const newHeight = parseInt(canvasHeightInput.value);

  if (newWidth >= 100 && newHeight >= 100) {
    paintCanvas.width = newWidth;
    paintCanvas.height = newHeight;
    ctx.clearRect(0, 0, newWidth, newHeight); // Clear canvas after resize
  }
});

// Clear canvas
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
});

// Save Canvas as PNG
savePngBtn.addEventListener('click', () => {
  const dataURL = paintCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'drawing.png';
  a.click();
});

// Save Canvas as JPG
saveJpgBtn.addEventListener('click', () => {
  const dataURL = paintCanvas.toDataURL('image/jpeg');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'drawing.jpg';
  a.click();
});
