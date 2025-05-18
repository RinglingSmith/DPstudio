// layer.js
const canvasWrapper = document.getElementById('canvasWrapper');
const layerList = document.getElementById('layerList');

let layers = [];
let activeLayerIndex = 0;
let painting = false;

addLayer(); // Add the first layer when the page loads

// Function to add a new layer
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

  activeLayerIndex = layers.length - 1; // Set this as the active layer
  updateLayerList();
  attachCanvasEvents(canvas);
}

// Function to remove the most recent layer
function removeLayer() {
  if (layers.length <= 1) return alert("Can't remove the last layer!");
  
  const removedLayer = layers.pop();
  canvasWrapper.removeChild(removedLayer.canvas);

  activeLayerIndex = layers.length - 1; // Set last layer as active
  updateLayerList();
}

// Function to update the list of layers
function updateLayerList() {
  layerList.innerHTML = '';
  layers.forEach((layer, i) => {
    const li = document.createElement('li');
    li.textContent = `Layer ${i + 1}`;
    li.style.cursor = 'pointer';
    if (i === activeLayerIndex) li.style.fontWeight = 'bold'; // Highlight active layer
    li.onclick = () => {
      activeLayerIndex = i;
      updateLayerList(); // Update UI
    };
    layerList.appendChild(li);
  });
}

// Get mouse position relative to the canvas
function getPos(evt, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

// Event listeners for drawing
function attachCanvasEvents(canvas) {
  canvas.addEventListener('mousedown', (e) => {
    painting = true;
    const { ctx } = layers[activeLayerIndex];
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!painting) return;
    const { ctx } = layers[activeLayerIndex];
    const pos = getPos(e, canvas);
    ctx.lineWidth = document.getElementById('brushSize').value;
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    ctx.lineCap = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });

  // Stop drawing on mouseup or mouseleave
  ['mouseup', 'mouseleave'].forEach(event =>
    canvas.addEventListener(event, () => {
      painting = false;
      const { ctx } = layers[activeLayerIndex];
      ctx.closePath();
    })
  );
}
