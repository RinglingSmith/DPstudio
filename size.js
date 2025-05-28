// size.js
function changeCanvasSize(container, layerManager, canvasController, width, height) {
  container.style.width = width + 'px';
  container.style.height = height + 'px';
  layerManager.resizeLayers(width, height);
  
  // Optionally reset zoom/pan or keep current state
  canvasController.offsetX = 0;
  canvasController.offsetY = 0;
  canvasController.scale = 1;
  canvasController.updateTransforms();
}

// Expose it globally if you want
window.changeCanvasSize = changeCanvasSize;
