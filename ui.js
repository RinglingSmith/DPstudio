// ui.js - wire up toolbar and UI elements

function setupUI(toolManager, layerManager, historyManager, canvasController) {
  const tools = ['brush', 'eraser', 'fill', 'rect', 'circle'];
  tools.forEach(tool => {
    document.getElementById(tool).addEventListener('click', () => {
      toolManager.setTool(tool);
      document.querySelectorAll('#toolbar .tool').forEach(btn => btn.classList.remove('active'));
      document.getElementById(tool).classList.add('active');
    });
  });

  document.getElementById('colorPicker').addEventListener('input', (e) => {
    toolManager.setColor(e.target.value);
  });

  document.getElementById('brushSize').addEventListener('input', (e) => {
    toolManager.setSize(parseInt(e.target.value, 10));
  });

  document.getElementById('undo').addEventListener('click', () => {
    historyManager.undo();
  });

  document.getElementById('redo').addEventListener('click', () => {
    historyManager.redo();
  });

  document.getElementById('save').addEventListener('click', () => {
    saveImage(layerManager);
  });

  // Layers UI
  const layerSelect = document.getElementById('layerSelect');

  function refreshLayerSelect() {
    layerSelect.innerHTML = '';
    layerManager.layers.forEach((layer, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = layer.name + (i === layerManager.activeLayerIndex ? ' (Active)' : '');
      layerSelect.appendChild(opt);
    });
    layerSelect.value = layerManager.activeLayerIndex;
  }

  document.getElementById('addLayer').addEventListener('click', () => {
    const index = layerManager.addLayer('Layer ' + (layerManager.layers.length + 1));
    refreshLayerSelect();
    toolManager.historyManager.saveState();
  });

  document.getElementById('delLayer').addEventListener('click', () => {
    const idx = parseInt(layerSelect.value, 10);
    if (idx !== -1) {
      layerManager.deleteLayer(idx);
      refreshLayerSelect();
      toolManager.historyManager.saveState();
    }
  });

  layerSelect.addEventListener('change', (e) => {
    const idx = parseInt(e.target.value, 10);
    if (layerManager.setActiveLayer(idx)) {
      refreshLayerSelect();
    }
  });

  refreshLayerSelect();

  // Canvas drawing events wired in script.js to integrate with pointer coords
}

window.setupUI = setupUI;
