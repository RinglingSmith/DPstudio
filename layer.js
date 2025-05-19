let isDrawing = false;
let ctx = null;
let lastX = 0, lastY = 0;

let currentLayer = null;
let layers = [];
let layerIdCounter = 0;

const layerList = document.getElementById('layerList');
const canvasWrapper = document.getElementById('canvasWrapper');

// Helper: Create new canvas
function createCanvas(id, width = 800, height = 600) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.id = id;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = layerIdCounter;
    canvas.style.pointerEvents = 'none'; // Turn on only for active layer
    return canvas;
}

// Add a new layer
function addLayer() {
    const id = `layer-${layerIdCounter++}`;
    const canvas = createCanvas(id);
    canvasWrapper.appendChild(canvas);
    layers.push(canvas);

    const li = document.createElement('li');
    li.textContent = id;
    li.style.cursor = 'pointer';
    li.onclick = () => setActiveLayer(id);
    layerList.appendChild(li);

    setActiveLayer(id); // Set newly added layer as active
}

// Remove topmost layer
function removeLayer() {
    if (layers.length <= 1) {
        alert('At least one layer must remain.');
        return;
    }

    const canvas = layers.pop();
    canvas.remove();

    // Remove from list
    layerList.lastChild.remove();

    // Set new top layer as active
    const newTop = layers[layers.length - 1];
    setActiveLayer(newTop.id);
}

// Activate a layer (set as target for drawing)
function setActiveLayer(id) {
    layers.forEach(layer => {
        layer.style.pointerEvents = 'none';
    });

    currentLayer = document.getElementById(id);
    currentLayer.style.pointerEvents = 'auto';

    console.log('Active layer:', id);
}


document.addEventListener('mousedown', (e) => {
    if (!currentLayer) return;
    ctx = currentLayer.getContext('2d');
    isDrawing = true;
    const rect = currentLayer.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

document.addEventListener('mousemove', (e) => {
    if (!isDrawing || !ctx) return;
    const rect = currentLayer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = document.getElementById('colorPicker').value;
    const size = document.getElementById('brushSize').value;

    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
});

document.addEventListener('mouseup', () => isDrawing = false);
document.addEventListener('mouseleave', () => isDrawing = false);

