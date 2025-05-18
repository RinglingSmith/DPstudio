// canvasPaintApp.js

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

// Painting state
let painting = false;

// Get mouse position relative to canvas
function getMousePos(evt) {
  const rect = paintCanvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Start drawing
function startPaint(evt) {
  painting = true;
  ctx.beginPath();
  const pos = getMousePos(evt);
  ctx.moveTo(pos.x, pos.y);
  draw(evt); // Immediate draw for click/tap
}

// Stop drawing
function endPaint() {
  painting = false;
  ctx.closePath();
}

// Draw on canvas
function draw(evt) {
  if (!painting) return;
  const pos = getMousePos(evt);

  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = parseInt(brushSize.value);
  ctx.lineCap = brushType.value; // 'round' or 'square'

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// Canvas event listeners
paintCanvas.addEventListener('mousedown', startPaint);
paintCanvas.addEventListener('mouseup', endPaint);
paintCanvas.addEventListener('mouseout', endPaint);
paintCanvas.addEventListener('mousemove', draw);

// Touch support (optional for mobile)
paintCanvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startPaint(e.touches[0]);
});
paintCanvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  endPaint();
});
paintCanvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  draw(e.touches[0]);
});

// Resize canvas
resizeCanvasBtn.addEventListener('click', () => {
  const newWidth = parseInt(canvasWidthInput.value);
  const newHeight = parseInt(canvasHeightInput.value);
  if (newWidth >= 100 && newHeight >= 100) {
    // Optional: Save current drawing as image
    const imageData = ctx.getImageData(0, 0, paintCanvas.width, paintCanvas.height);

    // Resize canvas
    paintCanvas.width = newWidth;
    paintCanvas.height = newHeight;

    // Restore image (optional, comment out if you want a clear canvas on resize)
    ctx.putImageData(imageData, 0, 0);
  }
});

// Clear canvas
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
});

// Save canvas as PNG
savePngBtn.addEventListener('click', () => {
  const dataURL = paintCanvas.toDataURL('image/png');
  downloadImage(dataURL, 'drawing.png');
});

// Save canvas as JPG
saveJpgBtn.addEventListener('click', () => {
  const dataURL = paintCanvas.toDataURL('image/jpeg', 0.9); // Quality optional
  downloadImage(dataURL, 'drawing.jpg');
});

// Helper to trigger download
function downloadImage(dataURL, filename) {
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
