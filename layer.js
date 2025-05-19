let currentLayerId = 1;
let layerCount = 1;

const canvasWrapper = document.getElementById('canvasWrapper');
const layerList = document.getElementById('layerList');

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

function switchToLayer(id) {
  const current = document.getElementById('paintCanvas');
  const target = document.getElementById(id);

  if (!target || target.id === current.id) return;

  // Copy current canvas into paintCanvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 800;
  tempCanvas.height = 600;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(current, 0, 0);

  // Copy target layer into paintCanvas
  const newCtx = current.getContext('2d');
  newCtx.clearRect(0, 0, current.width, current.height);
  newCtx.drawImage(target, 0, 0);

  currentLayerId = id;
}

// Save back paintCanvas content to layer
function saveCurrentToLayer() {
  const target = document.getElementById(currentLayerId);
  if (!target) return;

  const targetCtx = target.getContext('2d');
  const main = document.getElementById('paintCanvas');
  targetCtx.clearRect(0, 0, target.width, target.height);
  targetCtx.drawImage(main, 0, 0);
}

// Save before switching or clearing
document.getElementById('clearBtn').addEventListener('click', () => {
  saveCurrentToLayer();
});

document.getElementById('savePngBtn').addEventListener('click', () => {
  saveCurrentToLayer();
});

document.getElementById('saveJpgBtn').addEventListener('click', () => {
  saveCurrentToLayer();
});

window.addEventListener('beforeunload', () => saveCurrentToLayer());

// Optional: save every few seconds
setInterval(saveCurrentToLayer, 5000);
