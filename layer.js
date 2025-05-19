let layerCount = 1;
let currentCanvas = document.getElementById('paintCanvas');
let ctx = currentCanvas.getContext('2d');
let currentLayerId = 'paintCanvas'; // needed for saving

const canvasWrapper = document.getElementById('canvasWrapper');
const layerList = document.getElementById('layerList');

// Create initial list item for the first layer
const initialLi = document.createElement('li');
initialLi.textContent = 'Layer 1';
initialLi.dataset.layerId = 'paintCanvas';
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
}

// Remove the topmost layer
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

    // Switch back to previous layer
    switchToLayer(`layer${layerCount}`);
  }
}

// Switch which canvas is active for drawing
function switchToLayer(id) {
  const target = document.getElementById(id);
  if (!target || target.id === currentCanvas.id) return;

  currentCanvas = target;
  ctx = currentCanvas.getContext('2d');
  currentLayerId = id;

  // Optional: highlight active layer in the UI
  const lis = layerList.querySelectorAll('li');
  lis.forEach(li => {
    li.style.fontWeight = (li.dataset.layerId === id) ? 'bold' : 'normal';
  });
}

// Copy main drawing canvas to selected layer
function saveCurrentToLayer() {
  const target = document.getElementById(currentLayerId);
  if (!target) return;

  const targetCtx = target.getContext('2d');
  targetCtx.clearRect(0, 0, target.width, target.height);
  targetCtx.drawImage(currentCanvas, 0, 0);
}

// Save before switching or clearing
document.getElementById('clearBtn').addEventListener('click', () => {
  saveCurrentToLayer();
  ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
});

document.getElementById('savePngBtn').addEventListener('click', () => {
  saveCurrentToLayer();
  const dataURL = currentCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'drawing.png';
  a.click();
});

document.getElementById('saveJpgBtn').addEventListener('click', () => {
  saveCurrentToLayer();
  const dataURL = currentCanvas.toDataURL('image/jpeg');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'drawing.jpg';
  a.click();
});

window.addEventListener('beforeunload', () => saveCurrentToLayer());
setInterval(saveCurrentToLayer, 5000);