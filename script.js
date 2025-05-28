const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let painting = false;
let color = document.getElementById('color').value;
let stroke = document.getElementById('stroke').value;

canvas.addEventListener('mousedown', () => painting = true);
canvas.addEventListener('mouseup', () => {
  painting = false;
  ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!painting) return;

  ctx.lineWidth = stroke;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;

  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

// Color and stroke listeners
document.getElementById('color').addEventListener('input', e => {
  color = e.target.value;
});

document.getElementById('stroke').addEventListener('input', e => {
  stroke = e.target.value;
});

// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Resize dialog logic
const resizeBtn = document.getElementById('resize');
const resizeDialog = document.getElementById('resizeDialog');
const applyResize = document.getElementById('applyResize');
const cancelResize = document.getElementById('cancelResize');

resizeBtn.addEventListener('click', () => {
  document.getElementById('newWidth').value = canvas.width;
  document.getElementById('newHeight').value = canvas.height;
  resizeDialog.style.display = 'block';
});

cancelResize.addEventListener('click', () => {
  resizeDialog.style.display = 'none';
});

applyResize.addEventListener('click', () => {
  const width = parseInt(document.getElementById('newWidth').value);
  const height = parseInt(document.getElementById('newHeight').value);
  canvas.width = width;
  canvas.height = height;
  resizeDialog.style.display = 'none';
});
