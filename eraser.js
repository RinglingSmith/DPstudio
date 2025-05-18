let isEraser = false;
let painting = false;
let brushColor = colorPicker.value;
let brushWidth = brushSize.value;

let lastX = 0;
let lastY = 0;
const TOUCH_TOLERANCE = 4;

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
  lastX = pos.x;
  lastY = pos.y;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function endPaint() {
  if (painting) {
    ctx.stroke();
    ctx.closePath();
    saveState();
  }
  painting = false;
}

function draw(evt) {
  if (!painting) return;

  const pos = getMousePos(evt);
  const dx = Math.abs(pos.x - lastX);
  const dy = Math.abs(pos.y - lastY);

  if (dx >= TOUCH_TOLERANCE || dy >= TOUCH_TOLERANCE) {
    ctx.lineWidth = brushWidth;
    ctx.lineCap = 'round';

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
    }

    ctx.quadraticCurveTo(lastX, lastY, (pos.x + lastX) / 2, (pos.y + lastY) / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo((pos.x + lastX) / 2, (pos.y + lastY) / 2);

    lastX = pos.x;
    lastY = pos.y;
  }
}

// Eraser toggle
document.getElementById('eraserBtn').addEventListener('click', () => {
  isEraser = !isEraser;
  document.getElementById('eraserBtn').textContent = isEraser ? 'Pen' : 'Eraser';
});

// Canvas event listeners
paintCanvas.addEventListener('mousedown', startPaint);
paintCanvas.addEventListener('mouseup', endPaint);
paintCanvas.addEventListener('mouseout', endPaint);
paintCanvas.addEventListener('mousemove', draw);
