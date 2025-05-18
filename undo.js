// Store the history of canvas states
let history = [];
let historyIndex = -1; // Points to the current state in the history stack

// Save the current state of the canvas
function saveState() {
  // Save the current state of the canvas (as an image)
  historyIndex++;
  if (historyIndex < history.length) {
    history.length = historyIndex; // Remove any states ahead of the current index
  }
  history.push(paintCanvas.toDataURL());
}

// Undo the last action
function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    const lastState = history[historyIndex];
    const img = new Image();
    img.src = lastState;
    img.onload = function () {
      ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

// Event listener for mouse drawing
paintCanvas.addEventListener('mousedown', startPaint);
paintCanvas.addEventListener('mouseup', endPaint);
paintCanvas.addEventListener('mouseout', endPaint);
paintCanvas.addEventListener('mousemove', draw);

// Event listener for undo (Ctrl + Z)
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault(); // Prevent the default browser undo action
    undo();
  }
});

// Call saveState after every drawing action
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

  saveState(); // Save the state after every drawing
}

// Save canvas state when the page loads
window.onload = () => {
  saveState(); // Save the initial empty state
};
