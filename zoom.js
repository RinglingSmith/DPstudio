let scale = 1;

function zoomIn() {
    scale += 0.1;
    updateZoom();
}

function zoomOut() {
    scale = Math.max(0.1, scale - 0.1);
    updateZoom();
}

function updateZoom() {
    canvas.style.transform = `scale(${scale})`;
    layers.forEach(layer => {
        layer.style.transform = `scale(${scale})`;
    });
}

document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
