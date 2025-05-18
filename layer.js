let layerCount = 1;
const layerList = document.getElementById('layerList');
const canvasWrapper = document.getElementById('canvasWrapper');

function addLayer() {
  const layer = document.createElement('canvas');
  layer.width = paintCanvas.width;
  layer.height = paintCanvas.height;
  layer.className = 'layerCanvas';
  layer.style.position = 'absolute';
  layer.style.top = '0';
  layer.style.left = '0';
  layer.style.zIndex = layerCount;
  layer.id = `layer${layerCount}`;
  canvasWrapper.appendChild(layer);

  const li = document.createElement('li');
  li.textContent = `Layer ${layerCount}`;
  li.dataset.layerId = layer.id;
  li.onclick = () => selectLayer(layer.id);
  layerList.appendChild(li);

  layerCount++;
}

function removeLayer() {
  if (layerCount <= 1) return;
  layerCount--;
  const canvasToRemove = document.getElementById(`layer${layerCount}`);
  canvasWrapper.removeChild(canvasToRemove);
  layerList.removeChild(layerList.lastChild);
}

function selectLayer(id) {
  const canvas = document.getElementById(id);
  ctx = canvas.getContext('2d');
}
