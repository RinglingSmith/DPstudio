const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let painting = false;

function startPaint(e) {
  painting = true;
  draw(e);
}

function endPaint() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;

  ctx.lineWidth = document.getElementById('brushSize').value;
  ctx.lineCap = 'round';
  ctx.strokeStyle = document.getElementById('colorPicker').value;

  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

canvas.addEventListener('mousedown', startPaint);
canvas.addEventListener('mouseup', endPaint);
canvas.addEventListener('mouseout', endPaint);
canvas.addEventListener('mousemove', draw);

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
