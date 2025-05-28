// export.js - export final composite image as PNG

function saveImage(layerManager) {
  if (layerManager.layers.length === 0) return;
  const width = layerManager.layers[0].canvas.width;
  const height = layerManager.layers[0].canvas.height;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = width;
  exportCanvas.height = height;
  const ctx = exportCanvas.getContext('2d');

  // Draw each layer in order
  layerManager.layers.forEach(({canvas}) => {
    ctx.drawImage(canvas, 0, 0);
  });

  const dataURL = exportCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = dataURL;
  link.click();
}

window.saveImage = saveImage;
