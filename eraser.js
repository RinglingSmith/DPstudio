// Store the history of canvas states
let history = [];
let historyIndex = -1; // Points to the current state in the history stack

// Variables for drawing and erasing
let painting = false;
let brushColor = document.getElementById('colorPicker').value; // Brush color
let brushWidth = document.getElementById('brushSize').value; // Brush size
let isEraser = false; // Flag to check if eraser tool is selected

// Set the canvas and context
const paintCanvas = document.getElementById('paintCanvas');
const ctx = paintCanvas.getContext('2d');

// Get mouse position
function getMousePos(evt) {
  const rect = paintCanvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Save the current state of the canvas
function saveState() {
  const state = paintCanvas.toDataURL();  // Get the current image data
  historyIndex++;
  if (historyIndex < history.length) {
    history.length = historyIndex; // Remove any states ahead of the current index
  }
  history.push(state); // Push the state to history stack
}

// Undo the last action
function undo() {
  if (historyIndex > 0) {
    historyIndex--; // Go back to the previous state
    const lastState = history[historyIndex]; // Get the state from history
    const img = new Image();
    img.src = lastState;
    img.onload = function () {
      ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height); // Clear the current canvas
      ctx.drawImage(img, 0, 0); // Draw the previous state
    };
  }
}

// Start drawing or erasing
function startPaint(evt) {
  painting = true;
  const pos = getMousePos(evt);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// End drawing or erasing
function endPaint() {
  painting = false;
  ctx.closePath();
}

// Draw on canvas or erase
function draw(evt) {
  if (!painting) return;

  const pos = getMousePos(evt);
  if (isEraser) {
    ctx.globalCompositeOperation = 'destination-out'; // Set composite operation for eraser
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Eraser color (just needs to be a visible color)
  } else {
    ctx.globalCompositeOperation = 'source-over'; // Reset to normal drawing
    ctx.strokeStyle = brushColor; // Drawing color
  }

  ctx.lineWidth = brushWidth;
  ctx.lineCap = 'round';

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  saveState(); // Save the state after drawing or erasing
}

// Event listeners for mouse drawing and erasing
paintCanvas.addEventListener('mousedown', startPaint);
paintCanvas.addEventListener('mouseup', endPaint);
paintCanvas.addEventListener('mouseout', endPaint);
paintCanvas.addEventListener('mousemove', draw);

// Event listener for undo (Ctrl + Z)
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault(); // Prevent default undo action
    undo();
  }
});

// Event listener for undo button
document.getElementById('undoBtn').addEventListener('click', undo);

// Event listener for eraser button
document.getElementById('eraserBtn').addEventListener('click', () => {
  isEraser = !isEraser; // Toggle between drawing and erasing
  document.getElementById('eraserBtn').textContent = isEraser ? 'Pen' : 'Eraser'; // Change button text
});

// Initialize by saving the empty canvas state
window.onload = () => {
  saveState(); // Save initial empty state when the page loads
};
