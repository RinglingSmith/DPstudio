const canvasWrapper = document.getElementById('canvasWrapper');
const layerList = document.getElementById('layerList');

let layers = [];
let activeLayerIndex = 0;
let painting = false;

addLayer(); // Start with one layer

function addLayer() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  canvas.className = 'layerCanvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';

  const ctx = canvas.getContext('2d');
  canvasWrapper.appendChild(canvas);
  layers.push({ canvas, ctx });

  activeLayerIndex = layers.length - 1;
  updateLayerList();
}

function removeLayer() {
  if (layers.length <= 1) return alert("Can't remove the last layer");
  const removed = layers.pop();
  canvasWrapper.removeChild(removed.canvas);
  activeLayerIndex = layers.length - 1;
  updateLayerList();
}

function updateLayerList() {
  layerList.innerHTML = '';
  layers.forEach((layer, i) => {
    const li = document.createElement('li');
    li.textContent = `Layer ${i + 1}`;
    li.style.cursor = 'pointer';
    li.style.fontWeight = i === activeLayerIndex ? 'bold' : 'normal';
    li.onclick = () => {
      activeLayerIndex = i;
      updateLayerList();
    };
    layerList.appendChild(li);
  });
}

function getPos(evt, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

canvasWrapper.addEventListener('mousedown', (e) => {
  painting = true;
  const { ctx, canvas } = layers[activeLayerIndex];
  const pos = getPos(e, canvas);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

canvasWrapper.addEventListener('mousemove', (e) => {
  if (!painting) return;
  const { ctx, canvas } = layers[activeLayerIndex];
  const pos = getPos(e, canvas);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#000';
  ctx.lineCap = 'round';
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

['mouseup', 'mouseleave'].forEach(event =>
  canvasWrapper.addEventListener(event, () => {
    painting = false;
    const { ctx } = layers[activeLayerIndex];
    ctx.closePath();
  })
);
