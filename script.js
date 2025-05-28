window.addEventListener('load', () => {
  const container = document.getElementById('canvasContainer');
  const layerManager = new LayerManager(container);
  const historyManager = new HistoryManager(layerManager);
  const toolManager = new ToolManager(layerManager, historyManager);

  // Pass a function returning whether drawing is active
  const canvasController = new CanvasController(layerManager, () => toolManager.drawing);

  // Start with one layer
  layerManager.addLayer('Layer 1');

  // Setup UI controls
  setupUI(toolManager, layerManager, historyManager, canvasController);

  // Handle canvas drawing pointer events
  container.addEventListener('pointerdown', e => {
    const coords = canvasController.clientToCanvasCoords(e.clientX, e.clientY);
    toolManager.startDrawing(coords.x, coords.y);
  });

  container.addEventListener('pointermove', e => {
    if (!toolManager.drawing) return;
    const coords = canvasController.clientToCanvasCoords(e.clientX, e.clientY);
    toolManager.draw(coords.x, coords.y);
  });

  container.addEventListener('pointerup', e => {
    if (!toolManager.drawing) return;
    const coords = canvasController.clientToCanvasCoords(e.clientX, e.clientY);
    toolManager.stopDrawing(coords.x, coords.y);
  });

  container.addEventListener('pointerleave', e => {
    if (!toolManager.drawing) return;
    const coords = canvasController.clientToCanvasCoords(e.clientX, e.clientY);
    toolManager.stopDrawing(coords.x, coords.y);
  });

  // Resize layers on window resize
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    layerManager.resizeLayers(width, height);
  });

  // Initial resize
  const initWidth = container.clientWidth;
  const initHeight = container.clientHeight;
  layerManager.resizeLayers(initWidth, initHeight);

  // Save initial state
  historyManager.saveState();
});

// example usage inside script.js
const container = document.getElementById('canvasContainer');

document.getElementById('resizeBtn').addEventListener('click', () => {
  const width = parseInt(document.getElementById('widthInput').value, 10);
  const height = parseInt(document.getElementById('heightInput').value, 10);
  changeCanvasSize(container, layerManager, canvasController, width, height);
  historyManager.saveState();
});
