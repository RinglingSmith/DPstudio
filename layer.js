let layerCount = 1;
let currentCanvas = document.getElementById('paintCanvas');
let ctx = currentCanvas.getContext('2d');
let currentLayerId = 'paintCanvas';

const canvasWrapper = document.getElementById('canvasWrapper');
const layerList = document.getElementById('layerList');

// Init: style base canvas and add to layer list
currentCanvas.style.position = 'absolute';
currentCanvas.style.top = 0;
currentCanvas.style.left = 0;
currentCanvas.style.zIndex = 1;

const initialLi = document.createElement('li');
initialLi.textContent = 'Layer 1';
initialLi.dataset.layerId = 'paintCanvas';
initialLi.style.fontWeight = 'bold';
initialLi.onclick = () => switchToLayer('paintCanvas');
layerList.appendChild(initialLi);

// Add a new layer
function addLayer() {
  layerCount++;
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  canvas.classList.add('layer');
  canvas.id = `layer${layerCount}`;
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = layerCount;
  canvasWrapper.appendChild(canvas);

  const li = document.createElement('li');
  li.textContent = `Layer ${layerCount}`;
  li.dataset.layerId = canvas.id;
  li.onclick = () => switchToLayer(canvas.id);
  layerList.appendChild(li);

  switchToLayer(canvas.id);
}

// Remove top layer
function removeLayer() {
  if (layerCount <= 1) {
    alert("At least one layer must remain.");
    return;
  }

  const lastLayer = document.getElementById(`layer${layerCount}`);
  if (lastLayer) {
    lastLayer.remove();
    layerList.removeChild(layerList.lastChild);
    layerCount--;

    switchToLayer(`layer${layerCount}`);
  }
}

// Switch active layer for drawing
function switchToLayer(id) {
  const target = document.getElementById(id);
  if (!target || id === currentLayerId) return;

  currentCanvas = target;
  ctx = currentCanvas.getContext('2d');
  currentLayerId = id;

  // Highlight active layer in list
  const lis = layerList.querySelectorAll('li');
  lis.forEach(li => {
    li.style.fontWeight = (li.dataset.layerId === id) ? 'bold' : 'normal';
  });
}

// Save canvas contents to current layer (for export or backup)
function saveCurrentToLayer() {
  const target = document.getElementById(currentLayerId);
  if (!target || target === currentCanvas) return;

  const targetCtx = target.getContext('2d');
  targetCtx.clearRect(0, 0, target.width, target.height);
  targetCtx.drawImage(currentCanvas, 0, 0);
}

// Clear current layer
document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
});

// Export as PNG
document.getElementById('savePngBtn').addEventListener('click', () => {
  const dataURL = currentCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'drawing.png';
  a.click();
});

// Export as JPG
document.getElementById('saveJpgBtn').addEventListener('click', () => {
  const dataURL = currentCanvas.toDataURL('image/jpeg');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'drawing.jpg';
  a.click();
});

// Autosave on exit and interval
window.addEventListener('beforeunload', () => saveCurrentToLayer());
setInterval(saveCurrentToLayer, 5000);
