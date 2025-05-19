// Add layer logic
let currentLayer = 0; // Tracks the active layer
let layers = [];

function addLayer() {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = 800;
    newCanvas.height = 600;
    newCanvas.style.position = 'absolute';
    newCanvas.style.top = 0;
    newCanvas.style.left = 0;

    document.getElementById('canvasWrapper').appendChild(newCanvas);
    layers.push(newCanvas);

    // Make the current layer the active one for drawing
    currentLayer = layers.length - 1;
}

document.getElementById('addLayerBtn').addEventListener('click', addLayer);
