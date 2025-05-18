const canvasWrapper = document.getElementById('canvasWrapper');
const layerList = document.getElementById('layerList');

let layers = [];
let activeLayerIndex = 0;

// Initial setup
addLayer(); // Add the first layer

function addLayer() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  canvas.className = 'layerCanvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvasWrapper.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  layers.push({ canvas, ctx });

  activeLayerIndex = layers.length - 1;
  updateLayerUI();
  attachCanvasEvents(canvas);
}

function removeLayer() {
  if (layers.length <= 1) return alert('You need at least one layer.');

  const layer = layers.pop();
  canvasWrapper.removeChild(layer.canvas);
  activeLayerIndex = layers.length - 1;
  updateLayerUI();
}

function updateLayerUI() {
  layerList.innerHTML = '';
  layers.forEach((layer, i) => {
    const li = document.createElement('li');
    li.textContent = `Layer ${i + 1}`;
    li.style.cursor = 'pointer';
    if (i === activeLayerIndex) li.style.fontWeight = 'bold';
    li.onclick = () => {
      activeLayerIndex = i;
      updateLayerUI();
    };
    layerList.appendChild(li);
  });
}
