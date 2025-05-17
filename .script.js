const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let painting = false;

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function startPaint(evt) {
  painting = true;
  const pos = getMousePos(canvas, evt);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function endPaint() {
  painting = false;
  ctx.closePath();
}

function draw(evt) {
  if (!painting) return;

  const pos = getMousePos(canvas, evt);
  ctx.lineWidth = document.getElementById('brushSize').value;
  ctx.lineCap = 'round';
  ctx.strokeStyle = document.getElementById('colorPicker').value;

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

canvas.addEventListener('mousedown', startPaint);
canvas.addEventListener('mouseup', endPaint);
canvas.addEventListener('mouseout', endPaint);
canvas.addEventListener('mousemove', draw);

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
