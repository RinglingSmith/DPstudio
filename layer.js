let layers = [];
let currentLayerIndex = 0;

function addLayer() {
    const newLayer = document.createElement('canvas');
    newLayer.width = canvas.width;
    newLayer.height = canvas.height;
    newLayer.style.position = 'absolute';
    newLayer.style.top = '0';
    newLayer.style.left = '0';
    newLayer.style.zIndex = layers.length + 1;
    document.getElementById('canvasWrapper').appendChild(newLayer);
    layers.push(newLayer);
    currentLayerIndex = layers.length - 1;
}

function removeLayer() {
    if (layers.length > 1) {
        const layerToRemove = layers.pop();
        layerToRemove.remove();
        currentLayerIndex = layers.length - 1;
    }
}

function toggleLayerVisibility() {
    const layer = layers[currentLayerIndex];
    layer.style.display = (layer.style.display === 'none') ? 'block' : 'none';
}

function mergeLayers() {
    if (layers.length < 2) return;

    const topLayer = layers[currentLayerIndex];
    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;
    const mergedCtx = mergedCanvas.getContext('2d');

    layers.forEach(layer => {
        mergedCtx.drawImage(layer, 0, 0);
        layer.style.display = 'none'; // Hide layers after merging
    });

    // Remove all layers and add merged one
    layers = [mergedCanvas];
    currentLayerIndex = 0;
    document.getElementById('canvasWrapper').appendChild(mergedCanvas);
}

document.getElementById('addLayerBtn').addEventListener('click', addLayer);
document.getElementById('removeLayerBtn').addEventListener('click', removeLayer);
document.getElementById('toggleLayerBtn').addEventListener('click', toggleLayerVisibility);
document.getElementById('mergeLayersBtn').addEventListener('click', mergeLayers);
