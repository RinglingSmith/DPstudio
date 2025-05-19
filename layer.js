let layers = [];  // Store all layers
let currentLayerIndex = 0;  // Index to track which layer is selected

// Function to create a new layer
function addLayer() {
    const newLayer = document.createElement('canvas');
    newLayer.width = canvas.width;
    newLayer.height = canvas.height;
    newLayer.style.position = 'absolute';
    newLayer.style.top = '0';
    newLayer.style.left = '0';
    newLayer.style.zIndex = layers.length + 1;  // New layer should be on top
    newLayer.style.border = "1px dashed rgba(0,0,0,0.5)"; // Visualize layer borders for easier debugging

    // Append the new layer to the canvas container
    document.getElementById('canvasWrapper').appendChild(newLayer);
    layers.push(newLayer);
    currentLayerIndex = layers.length - 1;

    // Set the newly added layer as the active layer
    updateActiveLayer();
}

// Function to remove the last added layer
function removeLayer() {
    if (layers.length > 1) { // Keep at least one layer
        const layerToRemove = layers.pop();
        layerToRemove.remove();
        currentLayerIndex = layers.length - 1;
    } else {
        alert("Cannot remove the last layer.");
    }
    updateActiveLayer();
}

// Function to toggle visibility of the selected layer
function toggleLayerVisibility() {
    const layer = layers[currentLayerIndex];
    layer.style.display = (layer.style.display === 'none') ? 'block' : 'none';
}

// Function to merge all layers into the first layer (topmost layer)
function mergeLayers() {
    if (layers.length < 2) {
        alert("At least 2 layers are required to merge.");
        return;
    }

    // Create a new merged canvas layer
    const mergedLayer = document.createElement('canvas');
    mergedLayer.width = canvas.width;
    mergedLayer.height = canvas.height;
    const mergedCtx = mergedLayer.getContext('2d');

    // Merge all layers into the new canvas
    layers.forEach(layer => {
        mergedCtx.drawImage(layer, 0, 0);
        layer.style.display = 'none'; // Hide original layers after merging
    });

    // Replace all layers with the merged layer
    layers = [mergedLayer];
    currentLayerIndex = 0; // Only one layer left (merged layer)
    document.getElementById('canvasWrapper').appendChild(mergedLayer);
    updateActiveLayer();
}

// Update the active layer's z-index and visual state
function updateActiveLayer() {
    layers.forEach((layer, index) => {
        // Reset z-index
        layer.style.zIndex = index + 1;
    });
}

document.getElementById('addLayerBtn').addEventListener('click', addLayer);
document.getElementById('removeLayerBtn').addEventListener('click', removeLayer);
document.getElementById('toggleLayerBtn').addEventListener('click', toggleLayerVisibility);
document.getElementById('mergeLayersBtn').addEventListener('click', mergeLayers);

// Initially, we add one layer
addLayer();
