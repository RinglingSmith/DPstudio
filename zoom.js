let zoomLevel = 1;

function addLayer(type, content) {
    layers.push({ type, content });
    redrawCanvas();
}
